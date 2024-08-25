const response = require("../response/index");
const httpStatus = require("http-status");
const commonService = require("../services/common");
const db = require("../models/index").sequelize;
const { USER_TYPE } = require("../constant/auth");
const { Op } = require("sequelize");
const rateLimit = require("express-rate-limit");

exports.isUserExist = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { Auth } = db.models;
    const condition = { email: email.toLowerCase(), is_deleted: false };
    const checkUserExist = await commonService.findByCondition(Auth, condition);

    if (!checkUserExist) {
      return next();
    }

    return response.error(
      req,
      res,
      { msgCode: "USER_ALREADY_EXIST" },
      httpStatus.CONFLICT,
    );
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "SOMETHING_WRONG" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const { id } = req.data;
    const { Auth } = db.models;
    const condition = {
      id,
      is_deleted: false,
      user_type: USER_TYPE.SUPERADMIN,
    };
    const adminExist = await commonService.findByCondition(Auth, condition);

    if (adminExist) {
      return next();
    }
    return response.error(
      req,
      res,
      { msgCode: "ADMIN_DOESN'T_EXIST" },
      httpStatus.UNAUTHORIZED,
    );
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "SOMETHING_WRONG" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.isAdminOrSubadmin = async (req, res, next) => {
  try {
    const { id } = req.data;
    const { Auth } = db.models;
    const condition = {
      id,
      is_deleted: false,
      user_type: { [Op.or]: [USER_TYPE.SUBADMIN, USER_TYPE.SUPERADMIN] },
    };
    const adminExist = await commonService.findByCondition(Auth, condition);

    if (adminExist) {
      return next();
    }
    return response.error(
      req,
      res,
      { msgCode: "ADMIN_DOESN'T_EXIST" },
      httpStatus.UNAUTHORIZED,
    );
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "SOMETHING_WRONG" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.rateLimit = (req, res, next) => {
  try {
    const message = {
      success: false,
      status_code: 429,
      message: "You have surpassed api's rate limit.",
      result: {
        error: "error",
      },
      time: Date.now(),
    };
    return rateLimit({
      windowMs: 10 * 1000, // 12 hour duration in milliseconds
      max: 3,
      message,
      headers: true,
    });
  } catch (error) {
    return next();
  }
};
