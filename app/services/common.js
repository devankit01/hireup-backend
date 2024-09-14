const db = require("../models/index").sequelize;
const { Op } = require("sequelize");

exports.getList = async (
  model,
  condition,
  attributes,
  limit,
  offset,
  order,
  paranoid = true,
) => {
  try {
    const list = await model.findAndCountAll({
      ...(condition !== undefined && {
        where: condition,
      }),
      ...(attributes !== undefined && {
        attributes,
      }),
      distinct: true,
      ...(limit !== undefined && {
        limit,
      }),
      ...(offset !== undefined && {
        offset,
      }),
      ...(order !== undefined && {
        order,
      }),
      paranoid: paranoid,
    });
    return list ? JSON.parse(JSON.stringify(list)) : { count: 0, rows: [] };
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.getListWithAssociation = async (
  model,
  condition,
  includeCondition,
  attributes,
  limit,
  offset,
  order,
) => {
  try {
    const list = await model.findAndCountAll({
      ...(condition !== undefined && {
        where: condition,
      }),
      ...(includeCondition !== undefined && {
        include: includeCondition,
      }),
      ...(attributes !== undefined && {
        attributes,
      }),
      ...(limit !== undefined && {
        limit,
      }),
      ...(offset !== undefined && {
        offset,
      }),
      ...(order !== undefined && {
        order,
      }),
      distinct: true,
    });
    return list ? JSON.parse(JSON.stringify(list)) : {};
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.getListWithTransaction = async (
  model,
  condition,
  attributes,
  limit,
  offset,
  order,
  transaction,
) => {
  try {
    const list = await model.findAndCountAll(
      {
        ...(condition !== undefined && {
          where: condition,
        }),
        ...(attributes !== undefined && {
          attributes,
        }),
        distinct: true,
        ...(limit !== undefined && {
          limit,
        }),
        ...(offset !== undefined && {
          offset,
        }),
        ...(order !== undefined && {
          order,
        }),
      },
      { transaction },
    );
    return list ? JSON.parse(JSON.stringify(list)) : { count: 0, rows: [] };
  } catch (error) {
    return false;
  }
};

exports.getListing = async (model, condition, sorting, offset, limit) => {
  try {
    const list = await model.findAndCountAll({
      ...(condition !== undefined && {
        where: condition,
      }),
      order: sorting,
      distinct: true,
      ...(offset !== undefined && {
        offset,
      }),
      ...(limit !== undefined && {
        limit,
      }),
    });
    return list ? JSON.parse(JSON.stringify(list)) : { count: 0, rows: [] };
  } catch (error) {
    return false;
  }
};

exports.getDataList = async (
  model,
  condition,
  sorting,
  attributes,
  limit,
  offset,
) => {
  try {
    const list = await model.findAndCountAll({
      ...(condition !== undefined && {
        where: condition,
      }),
      order: sorting,
      ...(attributes !== undefined && {
        attributes,
      }),
      ...(limit !== undefined && { limit }),
      ...(offset !== undefined && { offset }),
    });
    return list ? JSON.parse(JSON.stringify(list)) : { count: 0, rows: [] };
  } catch (error) {
    console.log(
      "🚀 ~ file: common.js:69 ~ exports.getDataList= ~ error:",
      error,
    );
    return false;
  }
};

exports.addDetail = async (model, data, transaction) => {
  try {
    const addAuthInfo = await model.create(data, { transaction });
    return addAuthInfo ? JSON.parse(JSON.stringify(addAuthInfo)) : null;
  } catch (error) {
    console.log("🚀 ~ file: common.js:36 ~ exports.addDetail= ~ error:", error);
    return false;
  }
};

exports.bulkAdd = async (model, data, transaction) => {
  try {
    const addAuthInfo = await model.bulkCreate(data, { transaction });
    return addAuthInfo ? JSON.parse(JSON.stringify(addAuthInfo)) : null;
  } catch (error) {
    console.log("🚀 ~ file: common.js:68 ~ exports.bulkAdd= ~ error:", error);
    return false;
  }
};

exports.updateData = async (
  model,
  data,
  condition,
  transaction,
  returning = true,
  paranoid = true,
) => {
  try {
    const result = await model.update(data, {
      where: condition,
      paranoid: paranoid,
      transaction,
      returning,
    });
    return result || false;
  } catch (error) {
    console.log(
      "🚀 ~ file: common.js:67 ~ exports.updateData= ~ error:",
      error,
    );
    return false;
  }
};

exports.findByCondition = async (model, condition, paranoid = true) => {
  try {
    const data = await model.findOne({ where: condition, paranoid: paranoid });
    return data ? JSON.parse(JSON.stringify(data)) : null;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.findByconditionWithAssociation = async (
  model,
  condition,
  includeCondition,
  attributes,
  paranoid = false,
) => {
  try {
    const data = await model.findOne({
      where: condition,
      include: includeCondition,
      ...(attributes !== undefined && {
        attributes,
      }),
      paranoid: paranoid,
    });
    return data ? JSON.parse(JSON.stringify(data)) : null;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.findAllWithTransaction = async (model, condition, transaction) => {
  try {
    const data = await model.findAll({ where: condition, transaction });
    return data ? JSON.parse(JSON.stringify(data)) : null;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.findWithTransaction = async (model, condition, transaction) => {
  try {
    const data = await model.findOne({ where: condition, transaction });
    return data ? JSON.parse(JSON.stringify(data)) : null;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.deleteQuery = async (model, condition, transaction, force = false) => {
  try {
    const data = await model.destroy(
      { where: condition, force },
      { transaction },
    );

    return data ? JSON.parse(JSON.stringify(data)) : {};
  } catch (error) {
    return false;
  }
};

exports.count = async (model, condition, paranoid = true) => {
  try {
    const total = await model.count({ where: condition, paranoid: paranoid });
    return total ? JSON.parse(JSON.stringify(total)) : 0;
  } catch (error) {
    console.log("🚀 ~ file: common.js:114 ~ exports.count= ~ error:", error);
    return false;
  }
};

exports.getAuthDetail = async (model, condition, column) => {
  try {
    const { auths } = await db.models;
    const result = await model.findOne({
      include: [
        {
          model: auths,
          attributes: { exclude: ["created_at", "updated_at", "deleted_at"] },
        },
      ],
      where: condition,
    });
    return result ? JSON.parse(JSON.stringify(result)) : null;
  } catch (error) {
    return false;
  }
};

exports.emailExists = async (model, condition) => {
  try {
    const result = await model.findOne({
      where: condition,
    });
    return result ? JSON.parse(JSON.stringify(result)) : null;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.checkUserDetails = async (user_id, email, contact_number) => {
  try {
    const { auths } = db.models;
    let conditions = [];
    if (user_id) conditions.push({ user_id });
    if (email) conditions.push({ email });
    if (contact_number) conditions.push({ contact_number });

    const condition = {
      [Op.or]: conditions,
    };

    let userIdExists = await this.findByCondition(auths, condition);
    return userIdExists;
  } catch (error) {
    console.log(error);
    return false;
  }
};
