const assert = require("assert");

async function runTests() {
  const base = "http://localhost:3000";

  let response = await fetch(`${base}/`);
  assert.equal(response.status, 200);
  console.log("PASS: Home endpoint");

  response = await fetch(`${base}/products`);
  assert.equal(response.status, 200);
  const products = await response.json();
  assert.ok(Array.isArray(products));
  assert.ok(products.length >= 1);
  console.log("PASS: Get products");

  response = await fetch(`${base}/products/1`);
  assert.equal(response.status, 200);
  console.log("PASS: Get one product");

  response = await fetch(`${base}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: "Test Customer",
      items: [{ productId: 1, quantity: 1 }]
    })
  });
  assert.equal(response.status, 201);
  const order = await response.json();
  assert.equal(order.total, products.find(p => p.id === 1).price);
  console.log("PASS: Create order");

  response = await fetch(`${base}/orders/${order.id}`, { method: "DELETE" });
  assert.equal(response.status, 200);
  console.log("PASS: Delete order");

  console.log("All tests passed.");
}

runTests().catch(error => {
  console.error("Tests failed. Make sure the server is running with npm start.");
  console.error(error);
  process.exitCode = 1;
});
