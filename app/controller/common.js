const httpStatus = require("http-status");
const { Op } = require("sequelize");

const response = require("../response");
const helper = require("../utils/helper");
const db = require("../models/index").sequelize;
const commonService = require("../services/common");

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

    let { limit, offset } = helper.getPagination(page, size);
    const list = await commonService.getDataList(
      Model,
      condition,
      [[sort, sortOrder]],
      null,
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
      { msgCode: responseMsg.INTERNAL_SERVER_ERROR },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
