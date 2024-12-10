/** @format */

const fs = require("fs");
const cors = require("cors");
const path = require("path");
const jsonServer = require("json-server");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(cors({ origin: "http://localhost:3000" }));

server.use(middlewares);

const mockDataPath = path.join(__dirname, "mockData.json");

function loadMockData() {
  if (fs.existsSync(mockDataPath)) {
    return JSON.parse(fs.readFileSync(mockDataPath, "utf-8"));
  }
  return {};
}

let mockData = loadMockData();

server.get("/server-time", (_req, res) => {
  res.jsonp({ serverTime: Date.now() }); // Respond with the current timestamp
});

const router = jsonServer.router(mockData);
server.use(router);

fs.watchFile(mockDataPath, () => {
  console.log("Mock data file updated. Hot-reloading...");
  mockData = loadMockData();
  router.db.assign(mockData).write();
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running at http://localhost:${PORT}`);
});
