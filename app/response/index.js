const httpStatus = require("http-status");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

const lngMsg = {};
fs.readdirSync(path.join(__dirname, "lng"))
  .filter((file) => {
    return !file.startsWith(".") && file !== basename && file.endsWith(".json");
  })
  .forEach((file) => {
    const fileName = file.slice(0, -5);
    const lng = require(path.join(__dirname, "lng", file));
    lngMsg[fileName] = lng;
  });

exports.success = async (req, res, result, code, dbTrans) => {
  const lng = req.headers["accept-language"] || "en";
  try {
    const response = {
      success: true,
      status_code: code,
      // eslint-disable-next-line dot-notation
      message:
        (lngMsg[lng]
          ? lngMsg[lng][result.msgCode]
          : lngMsg["en"][result.msgCode]) ||
        result.msgCode ||
        httpStatus[code],
      result: result.data ? result.data : "",
      time: Date.now(),
    };
    if (dbTrans !== undefined) {
      await dbTrans.commit();
    }
    return res.status(code).json(response);
  } catch (error) {
    console.log("🚀 ~ file: index.js:31 ~ exports.success= ~ error:", error);
    if (dbTrans !== undefined) {
      await dbTrans.rollback();
    }
    return res.json({
      success: true,
      status_code: 500,
      // eslint-disable-next-line dot-notation
      message: lngMsg[lng]
        ? lngMsg[lng]["INTERNAL_SERVER_ERROR"]
        : lngMsg["en"]["INTERNAL_SERVER_ERROR"],
      result: "",
      time: Date.now(),
    });
  }
};

exports.error = async (req, res, error, code, dbTrans) => {
  // console.log("🚀 ~ file: index.js:47 ~ exports.error= ~ error:", error)
  const lng = req.headers["accept-language"] || "en";
  try {
    const response = {
      success: false,
      status_code: code,
      message:
        (lngMsg[lng] ? lngMsg[lng][error.msgCode] : lngMsg.en[error.msgCode]) ||
        error.msgCode ||
        httpStatus[code],
      result: {
        error: error.data
          ? error.data
          : (lngMsg[lng]
              ? lngMsg[lng][error.msgCode]
              : lngMsg.en[error.msgCode]) || error.msgCode,
      },
      time: Date.now(),
    };
    if (dbTrans !== undefined) {
      await dbTrans.rollback();
    }
    res.status(code).json(response);
  } catch (err) {
    if (dbTrans !== undefined) {
      await dbTrans.rollback();
    }
    return res.status(500).json({
      success: false,
      status_code: 500,
      // eslint-disable-next-line dot-notation
      message: lngMsg[lng]
        ? lngMsg[lng]["INTERNAL_SERVER_ERROR"]
        : lngMsg["en"]["INTERNAL_SERVER_ERROR"],
      result: "",
      time: Date.now(),
    });
  }
};
