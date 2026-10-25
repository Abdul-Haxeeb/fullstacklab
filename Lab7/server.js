const { createApp } = require("./src/app");

const port = Number(process.env.PORT) || 3000;
const server = createApp();

server.listen(port, () => {
  console.log(`Campus Record API running at http://localhost:${port}`);
});
