const routes = require("express").Router();
const controller = require("../../../controller/auth");
const {
  verifyAuthToken,
  verifyToken,
  reqValidator,
  verifyRefreshAuthToken,
} = require("../../../middleware");
const schema = require("../../../validation/auth");

routes.post(
  "/login",
  controller.checkUserStatus,
  controller.matchUserPassword,
  controller.checkUserTotalLogin,
  controller.login,
  controller.createSession,
);
routes.get("/token", verifyRefreshAuthToken, controller.getAccessToken);

routes.post(
  "/forgot-password",
  reqValidator(schema.forgotPassword),
  controller.forgotPassword,
);

routes.post(
  "/resend-otp",
  verifyToken,
  reqValidator(schema.forgotPassword),
  controller.resendOtp,
);

routes.post(
  "/verify-otp",
  verifyToken,
  reqValidator(schema.verifyOtp),
  controller.verifyOtp,
);

routes.post("/reset-password", verifyToken, controller.resetPassword);

routes.post("/logout", verifyAuthToken, controller.logout);

module.exports = routes;
