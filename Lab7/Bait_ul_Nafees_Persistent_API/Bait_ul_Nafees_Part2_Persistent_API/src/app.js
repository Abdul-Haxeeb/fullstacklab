const fs = require("fs");
const path = require("path");

const productsFile = path.join(__dirname, "..", "data", "products.json");
const ordersFile = path.join(__dirname, "..", "data", "orders.json");

function readData(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function nextId(items) {
  return items.length ? Math.max(...items.map(item => Number(item.id) || 0)) + 1 : 1;
}

function validProduct(product) {
  return product && typeof product.name === "string" && product.name.trim() &&
    typeof product.category === "string" && product.category.trim() &&
    Number.isFinite(Number(product.price)) && Number(product.price) >= 0;
}

async function handleRequest(req, res) {
  const url = new URL(req.url, "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);
  const method = req.method;

  if (method === "GET" && url.pathname === "/") {
    return sendJson(res, 200, {
      message: "Bait-ul-Nafees Persistent REST API",
      endpoints: ["/products", "/orders"]
    });
  }

  if (parts[0] === "products") {
    let products = readData(productsFile);
    const id = parts[1] ? Number(parts[1]) : null;

    if (method === "GET" && parts.length === 1) {
      return sendJson(res, 200, products);
    }

    if (method === "GET" && id !== null) {
      const product = products.find(item => item.id === id);
      return product ? sendJson(res, 200, product) : sendJson(res, 404, { error: "Product not found" });
    }

    if (method === "POST" && parts.length === 1) {
      const body = await readBody(req);
      if (!validProduct(body)) {
        return sendJson(res, 400, { error: "name, category, and a valid non-negative price are required" });
      }
      const product = {
        id: nextId(products),
        name: body.name.trim(),
        category: body.category.trim(),
        price: Number(body.price),
        description: typeof body.description === "string" ? body.description : ""
      };
      products.push(product);
      writeData(productsFile, products);
      return sendJson(res, 201, product);
    }

    if ((method === "PUT" || method === "PATCH") && id !== null) {
      const index = products.findIndex(item => item.id === id);
      if (index === -1) {
        return sendJson(res, 404, { error: "Product not found" });
      }
      const body = await readBody(req);
      const updated = method === "PUT"
        ? { id, ...body }
        : { ...products[index], ...body, id };
      if (!validProduct(updated)) {
        return sendJson(res, 400, { error: "name, category, and a valid non-negative price are required" });
      }
      updated.name = updated.name.trim();
      updated.category = updated.category.trim();
      updated.price = Number(updated.price);
      if (typeof updated.description !== "string") updated.description = "";
      products[index] = updated;
      writeData(productsFile, products);
      return sendJson(res, 200, updated);
    }

    if (method === "DELETE" && id !== null) {
      const index = products.findIndex(item => item.id === id);
      if (index === -1) {
        return sendJson(res, 404, { error: "Product not found" });
      }
      const deleted = products.splice(index, 1)[0];
      writeData(productsFile, products);
      return sendJson(res, 200, { message: "Product deleted", product: deleted });
    }
  }

  if (parts[0] === "orders") {
    let orders = readData(ordersFile);
    const id = parts[1] ? Number(parts[1]) : null;

    if (method === "GET" && parts.length === 1) {
      return sendJson(res, 200, orders);
    }

    if (method === "GET" && id !== null) {
      const order = orders.find(item => item.id === id);
      return order ? sendJson(res, 200, order) : sendJson(res, 404, { error: "Order not found" });
    }

    if (method === "POST" && parts.length === 1) {
      const body = await readBody(req);
      if (typeof body.customerName !== "string" || !body.customerName.trim() ||
          !Array.isArray(body.items) || body.items.length === 0) {
        return sendJson(res, 400, { error: "customerName and a non-empty items array are required" });
      }

      const products = readData(productsFile);
      let total = 0;
      const orderItems = [];

      for (const item of body.items) {
        const product = products.find(p => p.id === Number(item.productId));
        const quantity = Number(item.quantity);
        if (!product || !Number.isInteger(quantity) || quantity < 1) {
          return sendJson(res, 400, { error: "Each order item needs a valid productId and quantity of at least 1" });
        }
        orderItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity
        });
        total += product.price * quantity;
      }

      const order = {
        id: nextId(orders),
        customerName: body.customerName.trim(),
        items: orderItems,
        total,
        status: "Placed"
      };
      orders.push(order);
      writeData(ordersFile, orders);
      return sendJson(res, 201, order);
    }

    if (method === "DELETE" && id !== null) {
      const index = orders.findIndex(item => item.id === id);
      if (index === -1) {
        return sendJson(res, 404, { error: "Order not found" });
      }
      const deleted = orders.splice(index, 1)[0];
      writeData(ordersFile, orders);
      return sendJson(res, 200, { message: "Order deleted", order: deleted });
    }
  }

  return sendJson(res, 404, { error: "Endpoint not found" });
}

module.exports = { handleRequest };
