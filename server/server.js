import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const productsPath = path.join(__dirname, "data", "products.json");
const ordersPath = path.join(__dirname, "data", "orders.json");

const env = await loadEnv(path.join(root, ".env"));
const PORT = Number(env.PORT || process.env.PORT || 4173);
const ADMIN_EMAIL = env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || "owner@marketlane.local";
const STORE_NAME = env.STORE_NAME || process.env.STORE_NAME || "MarketLane";

const rateBucket = new Map();
const orderWindowMs = 10 * 60 * 1000;
const maxOrdersPerWindow = 8;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer(async (req, res) => {
  try {
    setSecurityHeaders(res);
    if (req.method === "OPTIONS") return send(res, 204, "");

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/api/products" && req.method === "GET") {
      return handleProducts(req, res, url);
    }

    if (url.pathname.startsWith("/api/products/") && req.method === "GET") {
      const id = decodeURIComponent(url.pathname.replace("/api/products/", ""));
      return handleProductDetail(res, id);
    }

    if (url.pathname === "/api/orders" && req.method === "POST") {
      return handleCreateOrder(req, res);
    }

    if (url.pathname.startsWith("/api/orders/") && req.method === "GET") {
      const orderId = decodeURIComponent(url.pathname.replace("/api/orders/", ""));
      return handleOrderDetail(res, orderId);
    }

    if (url.pathname.startsWith("/api/")) {
      return json(res, 404, { ok: false, message: "API endpoint not found." });
    }

    return serveStatic(res, url.pathname);
  } catch (error) {
    console.error(error);
    return json(res, 500, { ok: false, message: "Something went wrong. Please try again." });
  }
});

server.listen(PORT, () => {
  console.log(`${STORE_NAME} running at http://localhost:${PORT}`);
});

async function handleProducts(req, res, url) {
  const products = await readProducts();
  const search = sanitize(url.searchParams.get("search") || "").toLowerCase();
  const category = sanitize(url.searchParams.get("category") || "All");
  const min = Number(url.searchParams.get("min") || 0);
  const max = Number(url.searchParams.get("max") || Number.MAX_SAFE_INTEGER);
  const sort = sanitize(url.searchParams.get("sort") || "featured");

  let filtered = products.filter((product) => {
    const matchesSearch = !search || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(search);
    const matchesCategory = category === "All" || product.category === category;
    const matchesPrice = product.price >= min && product.price <= max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  filtered = filtered.sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const categories = ["All", ...new Set(products.map((product) => product.category))];
  return json(res, 200, { ok: true, products: filtered, categories });
}

async function handleProductDetail(res, id) {
  const products = await readProducts();
  const product = products.find((item) => item.id === id);
  if (!product) return json(res, 404, { ok: false, message: "Product not found." });
  return json(res, 200, { ok: true, product });
}

async function handleCreateOrder(req, res) {
  const ip = req.socket.remoteAddress || "local";
  if (!allowRequest(ip)) {
    return json(res, 429, { ok: false, message: "Too many order attempts. Please wait a few minutes." });
  }

  const body = await readBody(req);
  const products = await readProducts();
  const validation = validateOrder(body, products);
  if (!validation.ok) {
    return json(res, 400, { ok: false, message: "Please fix the highlighted checkout details.", errors: validation.errors });
  }

  const now = new Date().toISOString();
  const order = {
    orderId: createOrderId(),
    customer: validation.customer,
    items: validation.items,
    totalAmount: validation.totalAmount,
    status: "Confirmed",
    createdAt: now,
    updatedAt: now,
    notes: sanitize(body.notes || "")
  };

  const orders = await readOrders();
  orders.push(order);
  await fs.writeFile(ordersPath, `${JSON.stringify(orders, null, 2)}\n`, "utf8");
  await sendOrderEmails(order);

  return json(res, 201, { ok: true, message: "Order placed successfully.", order });
}

async function handleOrderDetail(res, orderId) {
  const orders = await readOrders();
  const order = orders.find((item) => item.orderId === orderId);
  if (!order) return json(res, 404, { ok: false, message: "Order not found." });
  return json(res, 200, { ok: true, order });
}

function validateOrder(body, products) {
  const errors = {};
  const customer = {
    fullName: sanitize(body.fullName),
    email: sanitize(body.email).toLowerCase(),
    phone: sanitize(body.phone),
    street: sanitize(body.street),
    city: sanitize(body.city),
    state: sanitize(body.state),
    postalCode: sanitize(body.postalCode),
    paymentMethod: sanitize(body.paymentMethod)
  };

  if (customer.fullName.length < 2) errors.fullName = "Enter a valid full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) errors.email = "Enter a valid email address.";
  if (!/^\d{7,15}$/.test(customer.phone.replace(/\s/g, ""))) errors.phone = "Phone number must contain 7 to 15 digits.";
  if (customer.street.length < 5) errors.street = "Street address is required.";
  if (customer.city.length < 2) errors.city = "City is required.";
  if (customer.state.length < 2) errors.state = "State is required.";
  if (!/^[A-Za-z0-9 -]{4,10}$/.test(customer.postalCode)) errors.postalCode = "Enter a valid postal code.";
  if (!["card", "upi", "cod"].includes(customer.paymentMethod)) errors.paymentMethod = "Choose a payment method.";

  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (!rawItems.length) errors.items = "Cart cannot be empty.";

  const items = [];
  for (const item of rawItems) {
    const product = products.find((entry) => entry.id === sanitize(item.productId));
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1) {
      errors.items = "Cart contains an invalid item.";
      continue;
    }
    if (quantity > product.stock) {
      errors.items = `${product.name} has only ${product.stock} item(s) in stock.`;
      continue;
    }
    items.push({
      productId: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity,
      lineTotal: product.price * quantity,
      imageUrl: product.imageUrl
    });
  }

  const totalAmount = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, customer, items, totalAmount };
}

async function sendOrderEmails(order) {
  const subject = `${STORE_NAME} order ${order.orderId}`;
  const products = order.items.map((item) => `${item.quantity} x ${item.name} - $${item.lineTotal.toFixed(2)}`).join("\n");
  const body = [
    subject,
    `Customer: ${order.customer.fullName} <${order.customer.email}>`,
    `Timestamp: ${order.createdAt}`,
    `Ship to: ${order.customer.street}, ${order.customer.city}, ${order.customer.state} ${order.customer.postalCode}`,
    "",
    products,
    "",
    `Total: $${order.totalAmount.toFixed(2)}`
  ].join("\n");

  console.log("Email notification queued");
  console.log("To customer:", order.customer.email);
  console.log("To admin:", ADMIN_EMAIL);
  console.log(body);
}

async function serveStatic(res, pathname) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(publicDir, cleanPath));
  if (!filePath.startsWith(publicDir)) return send(res, 403, "Forbidden");

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) throw new Error("Directory");
    const ext = path.extname(filePath).toLowerCase();
    const data = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  } catch {
    const fallback = await fs.readFile(path.join(publicDir, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    res.end(fallback);
  }
}

async function readProducts() {
  return JSON.parse(await fs.readFile(productsPath, "utf8"));
}

async function readOrders() {
  try {
    return JSON.parse(await fs.readFile(ordersPath, "utf8"));
  } catch {
    return [];
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

function allowRequest(key) {
  const now = Date.now();
  const bucket = rateBucket.get(key) || [];
  const fresh = bucket.filter((time) => now - time < orderWindowMs);
  fresh.push(now);
  rateBucket.set(key, fresh);
  return fresh.length <= maxOrdersPerWindow;
}

function createOrderId() {
  return `ML-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function sanitize(value = "") {
  return String(value).replace(/[<>]/g, "").trim();
}

function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function json(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function send(res, status, payload) {
  res.writeHead(status);
  res.end(payload);
}

async function loadEnv(envPath) {
  try {
    const text = await fs.readFile(envPath, "utf8");
    return Object.fromEntries(
      text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#") && line.includes("="))
        .map((line) => {
          const index = line.indexOf("=");
          return [line.slice(0, index), line.slice(index + 1)];
        })
    );
  } catch {
    return {};
  }
}
