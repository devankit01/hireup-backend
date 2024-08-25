// eslint-disable-next-line n/no-path-concat
require("app-module-path").addPath(`${__dirname}/`);
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const { errorHandler } = require("./app/middleware");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./app/models/index");

require("dotenv").config();

const app = express();
global.appRoot = path.join(__dirname);
app.set(path.join(__dirname));
app.use(express.static(__dirname));
app.use("/static", express.static(path.join(__dirname, "/app/public")));
app.use(cors());

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type",
  );

  res.setHeader("Etag", "null");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = http
  .createServer(app.handle.bind(app))
  .listen(process.env.PORT, () => {
    console.info(`Server up successfully - port: ${process.env.PORT}`);
  });
app.use("/api", require("./app/routes/index"));

// Error Middleware
app.use(errorHandler.methodNotAllowed);

process.on("unhandledRejection", (err) => {
  console.error("possibly unhandled rejection happened");
  console.error(err.message);
});

const closeHandler = () => {
  sequelize.close();
  httpServer.close(() => {
    console.info("Server is stopped successfully");
    process.exit(0);
  });
};

process.on("SIGTERM", closeHandler);
process.on("SIGINT", closeHandler);
