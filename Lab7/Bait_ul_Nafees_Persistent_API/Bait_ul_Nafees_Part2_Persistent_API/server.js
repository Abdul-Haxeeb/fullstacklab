const http = require("http");
const { handleRequest } = require("./src/app");

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});

server.listen(PORT, () => {
  console.log(`Bait-ul-Nafees API running at http://localhost:${PORT}`);
});
