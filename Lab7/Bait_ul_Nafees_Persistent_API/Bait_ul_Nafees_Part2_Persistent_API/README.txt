Bait-ul-Nafees - Lab 7 Part 2
Persistent REST API

Requirements:
- Node.js installed

Run:
1. Extract this ZIP.
2. Open the extracted folder in VS Code.
3. Open Terminal in VS Code.
4. Run: npm start
5. Open http://localhost:3000 in your browser.

Test:
- Keep the server running.
- Open a second terminal and run: npm test

Data persistence:
- Product data is saved in data/products.json.
- Order data is saved in data/orders.json.
- Changes made through POST, PUT, PATCH, and DELETE are written to these files, so they remain after the server restarts.

Endpoints:
GET    /
GET    /products
GET    /products/:id
POST   /products
PUT    /products/:id
PATCH  /products/:id
DELETE /products/:id
GET    /orders
GET    /orders/:id
POST   /orders
DELETE /orders/:id

Example: Add a product
POST http://localhost:3000/products
Content-Type: application/json

{
  "name": "Silver Ring",
  "category": "Rings & Bracelets",
  "price": 1800,
  "description": "A simple silver ring"
}

Example: Create an order
POST http://localhost:3000/orders
Content-Type: application/json

{
  "customerName": "Ali",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 5, "quantity": 1 }
  ]
}

Note:
This version uses JSON files for persistence and Node.js built-in modules, so no external packages are needed. If your professor specifically requires a database such as MongoDB or MySQL, this storage method should be replaced with that database.
