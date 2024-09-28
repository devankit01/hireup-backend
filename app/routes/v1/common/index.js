const routes = require("express").Router();
const controller = require("../../../controller/common");
const { reqValidator } = require("../../../middleware");

const schema = require("../../../validation/common");

routes.get("/state", controller.getMasterList);

routes.get("/district", controller.getMasterList);

routes.post(
  "/contact-us",
  reqValidator(schema.contactUs),
  controller.addContactUs
);

module.exports = routes;
