const jwt = require("jsonwebtoken");
const db = require("../models/index").sequelize;
const response = require("../response/index");
const httpStatus = require("http-status");
const commonService = require("../services/common");
const { env } = require("../constant/environment");
const constant = require("../constant/auth");
const { JWT_ERROR } = require("../constant/auth");

// This function is used for reqValidator API key

exports.verifyApiKey = (req, res, next) => {
  try {
    const ApiKey = req.headers["x-api-key"];
    if (!ApiKey) {
      return response.error(
        req,
        res,
        { msgCode: "MISSING_API_KEY" },
        httpStatus.UNAUTHORIZED,
      );
    }
    if (ApiKey !== env.API_KEY) {
      return response.error(
        req,
        res,
        { msgCode: "INVALID_API_KEY" },
        httpStatus.UNAUTHORIZED,
      );
    }
    return next();
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "SOMETHING_WRONG" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

// This function is used for generate jwt token

exports.generateAuthJwt = (payload) => {
  const { expires_in, ...params } = payload;
  const token = jwt.sign(params, env.SECRET_KEY, { expiresIn: expires_in });
  if (!token) {
    return false;
  }
  return token;
};

exports.verifyAuthToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return response.error(
        req,
        res,
        { msgCode: "MISSING_TOKEN" },
        httpStatus.UNAUTHORIZED,
      );
    }
    token = token.replace(/^Bearer\s+/, "");

    jwt.verify(token, env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        let msgCode = "INVALID_TOKEN";
        if (error.message === constant.JWT_ERROR.EXPIRED) {
          msgCode = "TOKEN_EXPIRED";
        }
        return response.error(req, res, { msgCode }, httpStatus.UNAUTHORIZED);
      }

      const { sessions } = await db.models;
      const condition = { jwt_token: token };

      const checkJwt = await commonService.getAuthDetail(sessions, condition);
      if (!checkJwt) {
        return response.error(
          req,
          res,
          { msgCode: "INVALID_TOKEN" },
          httpStatus.UNAUTHORIZED,
        );
      } else {
        const { password, ...user } = checkJwt.auth;
        req.data = { user, ...decoded };
        if (decoded.device_id == req.headers.device_id) {
          return next();
        } else {
          const dbTrans = await db.transaction();
          const condition = {
            auth_id: decoded.id,
            device_id: decoded.device_id,
          };

          const { sessions } = await db.models;
          await commonService.deleteQuery(sessions, condition, dbTrans, true);
          return response.error(
            req,
            res,
            { msgCode: "UNAUTHORIZED" },
            httpStatus.UNAUTHORIZED,
            dbTrans,
          );
        }
      }
    });
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "SOMETHING_WRONG" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.generateRefreshAuthJwt = (payload) => {
  const { expires_in, ...params } = payload;
  const token = jwt.sign(params, env.SECRET_KEY, { expiresIn: expires_in });
  if (!token) {
    return false;
  }
  return token;
};

exports.verifyRefreshAuthToken = (req, res, next) => {
  try {
    let token = req.headers.refresh_token;
    if (!token) {
      return response.error(
        req,
        res,
        { msgCode: "MISSING_TOKEN" },
        httpStatus.UNAUTHORIZED,
      );
    }
    jwt.verify(token, env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        console.log(error);
        let msgCode = "INVALID_TOKEN";
        if (error.message === constant.JWT_ERROR.EXPIRED) {
          msgCode = "TOKEN_EXPIRED";
        }
        return response.error(req, res, { msgCode }, httpStatus.UNAUTHORIZED);
      }

      const { sessions } = await db.models;
      const condition = { refresh_token: token };

      const checkJwt = await commonService.getAuthDetail(sessions, condition);
      if (!checkJwt) {
        return response.error(
          req,
          res,
          { msgCode: "INVALID_TOKEN" },
          httpStatus.UNAUTHORIZED,
        );
      } else {
        req.data = decoded;
        if (decoded.device_id == req.headers.device_id) {
          return next();
        } else {
          const dbTrans = await db.transaction();
          const condition = {
            auth_id: decoded.id,
            device_id: decoded.device_id,
          };

          const { sessions } = await db.models;
          await commonService.deleteQuery(sessions, condition, dbTrans, true);
          return response.error(
            req,
            res,
            { msgCode: "UNAUTHORIZED" },
            httpStatus.UNAUTHORIZED,
            dbTrans,
          );
        }
      }
    });
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "SOMETHING_WRONG" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.verifyOptionalAuthToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return next();
    }
    token = token.replace(/^Bearer\s+/, "");

    jwt.verify(token, env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        let msgCode = "INVALID_TOKEN";
        if (error.message === constant.JWT_ERROR.EXPIRED) {
          msgCode = "TOKEN_EXPIRED";
        }
        return response.error(req, res, { msgCode }, httpStatus.UNAUTHORIZED);
      }

      const { sessions } = await db.models;
      const condition = { jwt_token: token };

      const checkJwt = await commonService.getAuthDetail(sessions, condition);
      if (!checkJwt) {
        return response.error(
          req,
          res,
          { msgCode: "INVALID_TOKEN" },
          httpStatus.UNAUTHORIZED,
        );
      } else {
        req.data = decoded;
        if (decoded.device_id == req.headers.device_id) {
          return next();
        } else {
          const dbTrans = await db.transaction();
          const condition = {
            auth_id: decoded.id,
            device_id: decoded.device_id,
          };

          const { sessions } = await db.models;
          await commonService.deleteQuery(sessions, condition, dbTrans, true);
          return response.error(
            req,
            res,
            { msgCode: "UNAUTHORIZED" },
            httpStatus.UNAUTHORIZED,
            dbTrans,
          );
        }
      }
    });
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "SOMETHING_WRONG" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    const jwtData = req.data;
    if (jwtData.role !== constant.USER_TYPE.SUPER_ADMIN) {
      return response.error(
        req,
        res,
        { msgCode: "UNAUTHORIZED" },
        httpStatus.UNAUTHORIZED,
      );
    } else {
      req.data = jwtData;
      return next();
    }
  } catch (err) {
    return response.error(
      req,
      res,
      { msgCode: "SOMETHING_WRONG" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return response.error(
        req,
        res,
        { msgCode: "MISSING_TOKEN" },
        httpStatus.UNAUTHORIZED,
      );
    }
    token = token.replace(/^Bearer\s+/, "");
    jwt.verify(token, env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        console.log(error);
        let msgCode = "INVALID_TOKEN";
        if (error.message === constant.JWT_ERROR.EXPIRED) {
          msgCode = "TOKEN_EXPIRED";
        }
        return response.error(req, res, { msgCode }, httpStatus.UNAUTHORIZED);
      }
      req.token = decoded;
      return next();
    });
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "SOMETHING_WRONG" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.verifyOtpToken = (req, res, next) => {
  try {
    const { Otp } = db.models;
    let token = req.headers.token;
    if (!token) {
      return response.error(
        req,
        res,
        { msgCode: "MISSING_OTP_TOKEN" },
        httpStatus.UNAUTHORIZED,
      );
    }
    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        let msgCode = "INVALID_OTP_TOKEN";
        if (error.message === JWT_ERROR.EXPIRED) {
          msgCode = "OTP_TOKEN_EXPIRED";
        }
        return response.error(
          req,
          res,
          { msgCode },
          httpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      const validToken = await commonService.findByCondition(Otp, {
        otp_token: token,
      });
      if (!validToken) {
        return response.error(
          req,
          res,
          { msgCode: "INVALID_OTP_TOKEN" },
          httpStatus.UNAUTHORIZED,
        );
      }
      req.token = decoded;
      return next();
    });
  } catch (err) {
    return response.error(
      req,
      res,
      { msgCode: "SOMETHING_WRONG" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.bulkImportAccess = (req, res, next) => {
  try {
    const bulkImport = req.headers["x-bulk-import"];
    if (env.BULK_IMPORT !== bulkImport) {
      return response.error(
        req,
        res,
        { msgCode: "UNAUTHORIZED" },
        httpStatus.UNAUTHORIZED,
      );
    }
    return next();
  } catch (err) {
    return response.error(
      req,
      res,
      { msgCode: "SOMETHING_WRONG" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
