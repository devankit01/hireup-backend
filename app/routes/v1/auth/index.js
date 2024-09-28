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
  "/student/signup",
  reqValidator(schema.studentSignUp),
  controller.checkUserEmailExists,
  controller.checkUserPhoneExists,
  controller.checkCollegeExists,
  controller.studentSignUp
);

routes.post(
  "/college/signup",
  reqValidator(schema.collegeSignUp),
  controller.checkUserPhoneExists,
  controller.checkUserEmailExists,
  controller.checkStateExists,
  controller.checkDistrictExists,
  controller.collegeSignUp
);

routes.post(
  "/company/signup",
  reqValidator(schema.companySignUp),
  controller.checkUserPhoneExists,
  controller.checkUserEmailExists,
  controller.companySignUp
);

// routes.post(
//   "/recruiter/signup",
//   reqValidator(schema.recruiterSignUp),
//   controller.checkUserPhoneExists,
//   controller.checkUserEmailExists,
//   controller.recruiterSignUp
// );

routes.post(
  "/login",
  controller.checkUserStatus,
  controller.matchUserPassword,
  controller.checkUserTotalLogin,
  controller.login,
  controller.createSession
);
routes.get("/token", verifyRefreshAuthToken, controller.getAccessToken);

routes.post(
  "/forgot-password",
  reqValidator(schema.forgotPassword),
  controller.forgotPassword
);

routes.post(
  "/resend-otp",
  verifyToken,
  reqValidator(schema.forgotPassword),
  controller.resendOtp
);

routes.post(
  "/verify-otp",
  verifyToken,
  reqValidator(schema.verifyOtp),
  controller.verifyOtp
);

routes.post("/reset-password", verifyToken, controller.resetPassword);

routes.post("/logout", verifyAuthToken, controller.logout);

module.exports = routes;
