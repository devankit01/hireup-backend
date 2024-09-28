const httpStatus = require("http-status");
const { Op } = require("sequelize");

const response = require("../response");
const helper = require("../utils/helper");
const db = require("../models/index").sequelize;
const commonService = require("../services/common");
const { USER_STATUS, USER_TYPE } = require("../constant/auth");

exports.getMasterList = async (req, res) => {
  try {
    const {
      search,
      page,
      size,
      sort = "created_at",
      sortOrder = "DESC",
      state_id,
    } = req.query;
    const Model =
      db.models[req.originalUrl.split("?")[0].split("/").pop() + "s"];

    const condition = {};
    if (search) {
      condition.name = { [Op.iLike]: `%${search}%` };
    }
    if (state_id) condition.state_id = state_id;

    const { limit, offset } = helper.getPagination(page, size);
    const attributes = null;

    const list = await commonService.getDataList(
      Model,
      condition,
      [[sort, sortOrder]],
      attributes,
      limit,
      offset
    );
    const msgCode =
      list.count !== 0 ? "Master list fetched." : "No record fetched.";

    return response.success(req, res, { msgCode, data: list }, httpStatus.OK);
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

exports.addContactUs = async (req, res) => {
  const dbTrans = await db.transaction();
  try {
    const contactUsDetails = req.body;
    const { contact_us } = db.models;

    const createContactUs = await commonService.addDetail(
      contact_us,
      contactUsDetails,
      dbTrans
    );

    if (!createContactUs) {
      return response.error(
        req,
        res,
        { msgCode: "INTERNAL_SERVER_ERROR" },
        httpStatus.INTERNAL_SERVER_ERROR,
        dbTrans
      );
    }

    return response.success(
      req,
      res,
      { msgCode: "Contact us sent successfully." },
      httpStatus.OK,
      dbTrans
    );
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans
    );
  }
};

exports.getActiveCollegeList = async (req, res) => {
  try {
    const {
      search,
      page,
      size,
      sort = "created_at",
      sortOrder = "DESC",
    } = req.query;
    const { auths } = db.models;

    const condition = { role: USER_TYPE.COLLEGE, status: USER_STATUS.ACTIVE };
    if (search) {
      condition.name = { [Op.iLike]: `%${search}%` };
    }

    const { limit, offset } = helper.getPagination(page, size);
    const includeCondition = null,
      attributes = null;

    const list = await commonService.getListWithAssociation(
      auths,
      condition,
      includeCondition,
      attributes,
      limit,
      offset,
      [[sort, sortOrder]]
    );
    const msgCode =
      list.count !== 0 ? "College list fetched." : "No record fetched.";

    return response.success(req, res, { msgCode, data: list }, httpStatus.OK);
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

exports.getActiveCompanyList = async (req, res) => {
  try {
    const {
      search,
      page,
      size,
      sort = "created_at",
      sortOrder = "DESC",
    } = req.query;
    const { auths } = db.models;

    const condition = { role: USER_TYPE.COMPANY, status: USER_STATUS.ACTIVE };
    if (search) {
      condition.name = { [Op.iLike]: `%${search}%` };
    }

    const { limit, offset } = helper.getPagination(page, size);
    const includeCondition = null,
      attributes = null;

    const list = await commonService.getListWithAssociation(
      auths,
      condition,
      includeCondition,
      attributes,
      limit,
      offset,
      [[sort, sortOrder]]
    );
    const msgCode =
      list.count !== 0 ? "Company list fetched." : "No record fetched.";

    return response.success(req, res, { msgCode, data: list }, httpStatus.OK);
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};