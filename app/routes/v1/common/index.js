const routes = require("express").Router();
const controller = require("../../../controller/common");

routes.get("/state", controller.getMasterList);

routes.get("/district", controller.getMasterList);

module.exports = routes;
