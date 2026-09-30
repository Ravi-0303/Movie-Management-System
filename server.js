const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({
  static: "."
});

const PORT = process.env.PORT || 3000;

server.use(middlewares);

// Open login page when the main URL is opened
server.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

server.use(router);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
