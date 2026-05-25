const app = document.querySelector("#app");
const toastRegion = document.querySelector("#toast-region");

const state = {
  products: [], categories: ["All"], cart: readCart(), loading: true,
  filters: { search: "", category: "All", min: "", max: "", sort: "featured" },
  cartOpen: false, checkoutStep: 1, errors: {}, order: null,
  form: { fullName: "", email: "", phone: "", street: "", city: "", state: "", postalCode: "", paymentMethod: "card", notes: "" }
};
let searchTimer;
init();

async function init() { render(); await loadProducts(); }
async function loadProducts() {
  state.loading = true; renderCatalog();
  try {
    const params = new URLSearchParams();
    Object.entries(state.filters).forEach(([key, value]) => value && params.set(key, value));
    const response = await fetch(`/api/products?${params}`);
    const data = await response.json();
    if (!data.ok) throw new Error(data.message);
    state.products = data.products; state.categories = data.categories;
  } catch (error) {
    showToast(error.message || "Could not load products."); state.products = [];
  } finally { state.loading = false; render(); }
}

function render() {
  app.innerHTML = `<div class="shell">${Header()}<main>${Hero()}${Categories()}<section class="section" id="shop"><div class="section-head"><div><h2>Shop the collection</h2><p>Search, filter, sort, and add products without losing your place.</p></div><button class="btn ghost" data-action="open-cart" aria-label="Open cart">Cart total ${currency(cartTotals().total)}</button></div><div class="commerce-layout">${Filters()}<div id="catalog-region">${Catalog()}</div></div></section><section class="section" id="checkout">${Checkout()}</section></main>${Footer()}${CartDrawer()}</div>`;
  bindEvents();
}
function renderCatalog() { const region = document.querySelector("#catalog-region"); if (region) region.innerHTML = Catalog(); }

function Header() { return `<header class="site-header"><div class="header-inner"><a class="brand" href="#" aria-label="MarketLane home"><span class="brand-mark">M</span><span>MarketLane</span></a><nav class="nav-links" aria-label="Main navigation"><a href="#shop">Products</a><a href="#checkout">Checkout</a><a href="#footer">Support</a></nav><div class="header-actions"><label class="search-mini" aria-label="Search products"><input type="search" data-filter="search" value="${escapeHtml(state.filters.search)}" placeholder="Search products" /></label><button class="icon-btn" data-action="open-cart" aria-label="Open shopping cart"><span aria-hidden="true">Cart</span><span class="cart-count">${cartTotals().count}</span></button></div></div></header>`; }
function Hero() { return `<section class="hero"><div class="hero-content"><p class="eyebrow">Curated commerce, built end to end</p><h1>MarketLane</h1><p>A responsive shopping platform with live catalog filters, persistent cart, validated checkout, secure order APIs, and confirmation workflow.</p><div class="hero-actions"><a class="btn primary" href="#shop">Browse products</a><button class="btn secondary" data-action="open-cart">Review cart</button></div></div></section>`; }
function Categories() {
  const copy = { Travel: "Carry smarter for work trips and weekend plans.", Home: "Warm details for calmer rooms.", Fashion: "Everyday pieces with easy movement.", Kitchen: "Tools for better daily rituals.", Electronics: "Useful tech without the clutter.", Office: "Desktop essentials for focused work." };
  return `<section class="section" aria-label="Category shortcuts"><div class="section-head"><div><h2>Quick categories</h2><p>Jump into a section and keep browsing with the same live filters.</p></div></div><div class="category-grid">${state.categories.filter((category) => category !== "All").slice(0, 6).map((category) => `<button class="category-card" data-category-shortcut="${category}"><strong>${category}</strong><span>${copy[category] || "Explore curated products."}</span></button>`).join("")}</div></section>`;
}
function Filters() { return `<aside class="filters" aria-label="Product filters"><div class="field"><label for="catalog-search">Keyword search</label><input id="catalog-search" type="search" data-filter="search" value="${escapeHtml(state.filters.search)}" placeholder="Backpack, lamp, watch" /></div><div class="field"><label for="category">Category</label><select id="category" data-filter="category">${state.categories.map((category) => `<option ${category === state.filters.category ? "selected" : ""}>${category}</option>`).join("")}</select></div><div class="price-row"><div class="field"><label for="min">Min price</label><input id="min" type="number" min="0" data-filter="min" value="${escapeHtml(state.filters.min)}" placeholder="0" /></div><div class="field"><label for="max">Max price</label><input id="max" type="number" min="0" data-filter="max" value="${escapeHtml(state.filters.max)}" placeholder="200" /></div></div><div class="field"><label for="sort">Sort by</label><select id="sort" data-filter="sort"><option value="featured" ${state.filters.sort === "featured" ? "selected" : ""}>Newest</option><option value="price-asc" ${state.filters.sort === "price-asc" ? "selected" : ""}>Price: low to high</option><option value="price-desc" ${state.filters.sort === "price-desc" ? "selected" : ""}>Price: high to low</option><option value="name" ${state.filters.sort === "name" ? "selected" : ""}>Name</option></select></div><button class="btn ghost" data-action="clear-filters">Clear filters</button></aside>`; }
function Catalog() {
  if (state.loading) return `<div class="skeleton-grid" aria-label="Loading products">${Array.from({ length: 6 }, () => `<div class="skeleton"></div>`).join("")}</div>`;
  if (!state.products.length) return `<div class="empty-state"><p>No products match your filters yet.</p></div>`;
  return `<div class="product-grid">${state.products.map(ProductCard).join("")}</div>`;
}
function ProductCard(product) { return `<article class="product-card"><img src="${product.imageUrl}" alt="${escapeHtml(product.name)} product photo" loading="lazy" /><div class="product-body"><div class="meta-row"><span class="pill">${product.category}</span><span class="price">${currency(product.price)}</span></div><h3>${product.name}</h3><p>${product.description}</p><div class="meta-row"><span class="stock">${product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span><button class="btn primary" data-action="add" data-id="${product.id}" ${product.stock < 1 ? "disabled" : ""}>Add</button></div></div></article>`; }

function CartDrawer() {
  const totals = cartTotals();
  return `<section class="cart-drawer ${state.cartOpen ? "open" : ""}" aria-label="Shopping cart" aria-hidden="${!state.cartOpen}"><div class="drawer-backdrop" data-action="close-cart"></div><aside class="drawer-panel"><div class="drawer-head"><h2>Your cart</h2><button class="icon-btn" data-action="close-cart" aria-label="Close cart">X</button></div><div class="cart-items">${state.cart.length ? state.cart.map(CartItem).join("") : `<div class="empty-state"><p>Your cart is empty.</p></div>`}</div><div class="drawer-foot"><div class="summary-lines"><div><span>Subtotal</span><strong>${currency(totals.subtotal)}</strong></div><div><span>Shipping</span><strong>${currency(totals.shipping)}</strong></div><div class="total"><span>Total</span><span>${currency(totals.total)}</span></div></div><a class="btn primary" href="#checkout" data-action="close-cart">Checkout</a></div></aside></section>`;
}
function CartItem(item) { return `<div class="cart-item"><img src="${item.imageUrl}" alt="${escapeHtml(item.name)}" /><div><div class="meta-row"><h4>${item.name}</h4><strong>${currency(item.price * item.quantity)}</strong></div><span class="stock">${currency(item.price)} each</span><div class="qty-row"><button class="qty" data-action="dec" data-id="${item.productId}" aria-label="Decrease ${escapeHtml(item.name)} quantity">-</button><span class="qty" aria-live="polite">${item.quantity}</span><button class="qty" data-action="inc" data-id="${item.productId}" aria-label="Increase ${escapeHtml(item.name)} quantity">+</button><button class="btn ghost" data-action="remove" data-id="${item.productId}">Remove</button></div></div></div>`; }

function Checkout() {
  if (state.order) return Confirmation();
  const steps = ["Cart", "Details", "Review", "Confirm"];
  return `<div class="checkout"><div class="panel"><div class="steps">${steps.map((step, index) => `<div class="step ${state.checkoutStep === index + 1 ? "active" : ""}">${index + 1}. ${step}</div>`).join("")}</div>${CheckoutStep()}</div><aside class="panel"><h3>Order summary</h3>${OrderSummary()}</aside></div>`;
}
function CheckoutStep() {
  if (state.checkoutStep === 1) return `<h2>Cart review</h2>${state.cart.length ? state.cart.map(CartItem).join("") : `<div class="empty-state"><p>Add products before checkout.</p></div>`}<button class="btn primary" data-action="next-step" ${state.cart.length ? "" : "disabled"}>Continue</button>`;
  if (state.checkoutStep === 2) return `<h2>Customer details</h2><form id="checkout-form" class="form-grid" novalidate>${Input("fullName", "Full name", "text")}${Input("email", "Email address", "email")}${Input("phone", "Phone number", "tel")}${Input("street", "Street address", "text", true)}${Input("city", "City", "text")}${Input("state", "State", "text")}${Input("postalCode", "Postal code", "text")}<div class="field"><label for="paymentMethod">Payment method</label><select id="paymentMethod" data-form="paymentMethod"><option value="card" ${state.form.paymentMethod === "card" ? "selected" : ""}>Card</option><option value="upi" ${state.form.paymentMethod === "upi" ? "selected" : ""}>UPI</option><option value="cod" ${state.form.paymentMethod === "cod" ? "selected" : ""}>Cash on delivery</option></select><span class="error">${state.errors.paymentMethod || ""}</span></div><div class="field wide"><label for="notes">Order notes</label><textarea id="notes" data-form="notes" rows="3">${escapeHtml(state.form.notes)}</textarea><span class="error">${state.errors.notes || ""}</span></div></form><button class="btn ghost" data-action="prev-step">Back</button><button class="btn primary" data-action="next-step">Review order</button>`;
  if (state.checkoutStep === 3) return `<h2>Final review</h2><p class="stock">Shipping to ${escapeHtml(state.form.fullName)}, ${escapeHtml(state.form.street)}, ${escapeHtml(state.form.city)}.</p>${OrderSummary()}<button class="btn ghost" data-action="prev-step">Back</button><button class="btn primary" data-action="place-order">Place order</button>`;
  return `<h2>Confirming order</h2><div class="skeleton"></div>`;
}
function Input(name, label, type, wide = false) { return `<div class="field ${wide ? "wide" : ""}"><label for="${name}">${label}</label><input id="${name}" type="${type}" data-form="${name}" value="${escapeHtml(state.form[name])}" /><span class="error">${state.errors[name] || ""}</span></div>`; }
function OrderSummary() {
  const totals = cartTotals();
  return `<div>${state.cart.length ? state.cart.map((item) => `<div class="order-line"><span>${item.quantity} x ${item.name}</span><strong>${currency(item.price * item.quantity)}</strong></div>`).join("") : `<p class="stock">No items selected.</p>`}<div class="summary-lines"><div><span>Subtotal</span><strong>${currency(totals.subtotal)}</strong></div><div><span>Shipping</span><strong>${currency(totals.shipping)}</strong></div><div class="total"><span>Total</span><span>${currency(totals.total)}</span></div></div></div>`;
}
function Confirmation() { return `<div class="panel confirmation"><span class="success-mark">OK</span><h2>Order confirmed</h2><p>Your order ID is <strong>${state.order.orderId}</strong>. A confirmation email notification was queued for ${escapeHtml(state.order.customer.email)}.</p><div class="summary-lines"><div><span>Status</span><strong>${state.order.status}</strong></div><div><span>Placed</span><strong>${new Date(state.order.createdAt).toLocaleString()}</strong></div><div class="total"><span>Total</span><span>${currency(state.order.totalAmount)}</span></div></div><button class="btn primary" data-action="new-order">Start new order</button></div>`; }
function Footer() { return `<footer class="footer" id="footer"><div class="footer-inner"><strong>MarketLane</strong><span>Privacy Policy | Returns | Shipping | Terms</span><span>support@marketlane.local | Instagram | LinkedIn</span></div></footer>`; }

function bindEvents() {
  document.querySelectorAll("[data-action]").forEach((element) => element.addEventListener("click", handleAction));
  document.querySelectorAll("[data-filter]").forEach((element) => { element.addEventListener("input", handleFilter); element.addEventListener("change", handleFilter); });
  document.querySelectorAll("[data-form]").forEach((element) => { element.addEventListener("input", handleForm); element.addEventListener("change", handleForm); });
  document.querySelectorAll("[data-category-shortcut]").forEach((element) => element.addEventListener("click", () => { state.filters.category = element.dataset.categoryShortcut; location.hash = "#shop"; loadProducts(); }));
}
function handleAction(event) {
  const action = event.currentTarget.dataset.action; const id = event.currentTarget.dataset.id;
  if (action === "open-cart") state.cartOpen = true;
  if (action === "close-cart") state.cartOpen = false;
  if (action === "add") addToCart(id);
  if (action === "remove") removeFromCart(id);
  if (action === "inc") updateQty(id, 1);
  if (action === "dec") updateQty(id, -1);
  if (action === "clear-filters") { state.filters = { search: "", category: "All", min: "", max: "", sort: "featured" }; loadProducts(); }
  if (action === "next-step") nextStep();
  if (action === "prev-step") state.checkoutStep = Math.max(1, state.checkoutStep - 1);
  if (action === "place-order") placeOrder();
  if (action === "new-order") { state.order = null; state.checkoutStep = 1; state.form = { fullName: "", email: "", phone: "", street: "", city: "", state: "", postalCode: "", paymentMethod: "card", notes: "" }; }
  render();
}
function handleFilter(event) { const key = event.currentTarget.dataset.filter; state.filters[key] = event.currentTarget.value; clearTimeout(searchTimer); searchTimer = setTimeout(loadProducts, key === "search" ? 260 : 0); }
function handleForm(event) { const key = event.currentTarget.dataset.form; state.form[key] = event.currentTarget.value; validateField(key); const error = event.currentTarget.parentElement.querySelector(".error"); if (error) error.textContent = state.errors[key] || ""; }
function addToCart(id) { const product = state.products.find((item) => item.id === id); if (!product) return; const existing = state.cart.find((item) => item.productId === id); if (existing) existing.quantity = Math.min(product.stock, existing.quantity + 1); else state.cart.push({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, stock: product.stock, quantity: 1 }); persistCart(); showToast(`${product.name} added to cart.`); }
function removeFromCart(id) { const item = state.cart.find((entry) => entry.productId === id); state.cart = state.cart.filter((entry) => entry.productId !== id); persistCart(); showToast(`${item?.name || "Item"} removed from cart.`); }
function updateQty(id, delta) { const item = state.cart.find((entry) => entry.productId === id); if (!item) return; item.quantity = Math.min(item.stock || 99, item.quantity + delta); if (item.quantity <= 0) removeFromCart(id); else { persistCart(); showToast("Quantity updated."); } }
function nextStep() { if (state.checkoutStep === 2 && !validateForm()) return; state.checkoutStep = Math.min(3, state.checkoutStep + 1); }
async function placeOrder() {
  if (!validateForm()) { state.checkoutStep = 2; return; }
  state.checkoutStep = 4; render();
  try {
    const payload = { ...state.form, items: state.cart.map((item) => ({ productId: item.productId, quantity: item.quantity })) };
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (!data.ok) { state.errors = data.errors || {}; throw new Error(data.message); }
    state.order = data.order; state.cart = []; persistCart(); showToast("Order placed successfully.");
  } catch (error) { state.checkoutStep = state.errors && Object.keys(state.errors).length ? 2 : 3; showToast(error.message || "Order could not be placed."); }
  finally { render(); }
}
function validateForm() { ["fullName", "email", "phone", "street", "city", "state", "postalCode", "paymentMethod"].forEach(validateField); return !Object.values(state.errors).some(Boolean); }
function validateField(key) {
  const value = state.form[key].trim(); const errors = { ...state.errors };
  if (key === "fullName") errors[key] = value.length < 2 ? "Enter a valid full name." : "";
  if (key === "email") errors[key] = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email address.";
  if (key === "phone") errors[key] = /^\d{7,15}$/.test(value.replace(/\s/g, "")) ? "" : "Phone number must contain 7 to 15 digits.";
  if (key === "street") errors[key] = value.length < 5 ? "Street address is required." : "";
  if (key === "city") errors[key] = value.length < 2 ? "City is required." : "";
  if (key === "state") errors[key] = value.length < 2 ? "State is required." : "";
  if (key === "postalCode") errors[key] = /^[A-Za-z0-9 -]{4,10}$/.test(value) ? "" : "Enter a valid postal code.";
  if (key === "paymentMethod") errors[key] = value ? "" : "Choose a payment method.";
  state.errors = errors;
}
function cartTotals() { const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0); const shipping = subtotal > 0 && subtotal < 100 ? 8 : 0; return { subtotal, shipping, total: subtotal + shipping, count: state.cart.reduce((sum, item) => sum + item.quantity, 0) }; }
function persistCart() { localStorage.setItem("marketlane-cart", JSON.stringify(state.cart)); }
function readCart() { try { return JSON.parse(localStorage.getItem("marketlane-cart")) || []; } catch { return []; } }
function showToast(message) { const toast = document.createElement("div"); toast.className = "toast"; toast.textContent = message; toastRegion.append(toast); setTimeout(() => toast.remove(), 3200); }
function currency(value) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0); }
function escapeHtml(value = "") { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])); }
