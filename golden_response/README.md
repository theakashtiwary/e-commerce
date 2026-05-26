# MarketLane Ecommerce

MarketLane is a full-stack ecommerce build based on the supplied prompt. It includes a responsive product catalog, live search and filters, persistent cart, multi-step checkout, backend validation, rate limiting, JSON order storage, unique order IDs, and email notification logging.

## Folder Structure

- `public/` - Static frontend app, styles, SEO tags, catalog UI, cart drawer, checkout flow, toasts, and responsive layout.
- `server/server.js` - Node HTTP API server, static file server, validation, rate limiting, security headers, order persistence, and email notification hook.
- `server/data/products.json` - Seed product catalog.
- `server/data/orders.json` - Local order store for development.
- `.env.example` - Environment variable reference.

## Local Setup

This project is intentionally self-contained because no package manager is available in the current workspace.

```bash
node server/server.js
```

Then open:

```text
http://localhost:4173
```

Optional reset of the local order store:

```bash
node server/seed.js
```

## Environment Variables

Copy `.env.example` to `.env` and update values as needed.

- `PORT` - Local server port. Defaults to `4173`.
- `ADMIN_EMAIL` - Store owner email used by order notification logs.
- `STORE_NAME` - Store name shown in server logs.
- `EMAIL_MODE` - Current implementation logs email payloads. Use this to switch behavior when adding SMTP.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Reserved for SMTP/Nodemailer integration.

## API Endpoints

- `GET /api/products` - Supports `search`, `category`, `min`, `max`, and `sort`.
- `GET /api/products/:id` - Returns a single product.
- `POST /api/orders` - Validates and stores an order, generates a unique order ID, and logs customer/admin email notifications.
- `GET /api/orders/:id` - Returns stored order details.

## Database Notes

The prompt allows MongoDB with Mongoose or PostgreSQL with Prisma. This runnable version uses local JSON persistence so it works immediately without external services. The order and product shapes match the requested schemas, so swapping `readOrders`, `readProducts`, and the order write path for MongoDB or Prisma is straightforward.

## Deployment

1. Provision a Node.js runtime.
2. Set environment variables from `.env.example`.
3. Replace JSON storage with MongoDB/PostgreSQL for production.
4. Add Nodemailer/SMTP credentials or SendGrid/Mailgun.
5. Run `node server/server.js` behind a reverse proxy or platform router.

## Production Hardening

- Replace in-memory rate limiting with Redis-backed limits.
- Use Helmet, CORS, Morgan/Winston, Express Validator, and Nodemailer once dependencies are installed.
- Store credentials only in environment variables.
- Add automated tests around validation and order creation.
