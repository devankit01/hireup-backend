const routes = require("express").Router();
const controller = require("../../../controller/common");
const { reqValidator } = require("../../../middleware");

const schema = require("../../../validation/common");

routes.get("/state", controller.getMasterList);

routes.get("/district", controller.getMasterList);

routes.post(
  "/contact-us",
  reqValidator(schema.contactUs),
  controller.addContactUs,
);

routes.get("/college", controller.getActiveCollegeList);

routes.get("/company", controller.getActiveCompanyList);

routes.get(
  "/email/exist",
  reqValidator(schema.emailExists, "query"),
  controller.checkEmailExist,
);

routes.get(
  "/phone/exist",
  reqValidator(schema.phoneExists, "query"),
  controller.checkPhoneExist,
);

module.exports = routes;
