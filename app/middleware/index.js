const errorHandler = require("./error-handler");
// const auth =
const {
  generateAuthJwt,
  verifyAuthToken,
  isCompany,
  verifyToken,
  isAdmin,
  verifyOtpToken,
  generateRefreshAuthJwt,
  verifyRefreshAuthToken,
  bulkImportAccess,
} = require("./auth");
const { reqValidator } = require("./request-validator");
const { rateLimit } = require("./common");

module.exports = {
  generateAuthJwt,
  verifyAuthToken,
  isCompany,
  reqValidator,
  verifyToken,
  isAdmin,
  verifyOtpToken,
  errorHandler,
  rateLimit,
  verifyRefreshAuthToken,
  generateRefreshAuthJwt,
  bulkImportAccess,
};
