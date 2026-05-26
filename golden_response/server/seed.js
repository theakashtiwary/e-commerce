import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ordersPath = path.join(__dirname, "data", "orders.json");

await fs.writeFile(ordersPath, "[]\n", "utf8");
console.log("Order store reset:", ordersPath);
