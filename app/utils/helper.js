const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const response = require("../response/index");
const httpStatus = require("http-status");
const path = require("path");
const { PUBLIC_FOLDER } = require("../constant/common");
const { env } = require("../constant/environment");

exports.genUUID = () => {
  const uuid = uuidv4();
  return uuid;
};

exports.generateOtp = (digit) => {
  const otp = Math.floor(
    10 ** (digit - 1) + Math.random() * (10 ** (digit - 1) * 9),
  );
  return otp;
};

// eslint-disable-next-line no-undef
// const TRANSPORTER = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false,
//   requireTLS: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD
//   }
// });
const transporter = nodemailer.createTransport({
  service: env.SMTP_SERVICE,
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

exports.sendMail = async (data) => {
  try {
    const mailOptions = {
      from: env.SMTP_USER,
      to: data.email,
      subject: data.subject,
      html: data.template,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log(error);
  }
};

exports.getPagination = (page, size) => {
  const limit = size || 10;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

exports.getSuccessMsgCode = (req) => {
  let msgCode;
  if (req.url.slice(1) === "signup") {
    msgCode = "SIGNUP_SUCCESSFUL";
  } else {
    msgCode = "LOGIN_SUCCESSFUL";
  }

  return msgCode;
};

exports.getErrorMsgCode = (req) => {
  let msgCode;
  if (req?.url.slice(1) === "signup") {
    msgCode = "SIGNUP_FAILED";
  } else {
    msgCode = "LOGIN_FAILED";
  }

  return msgCode;
};

exports.generateOtp = (digit) => {
  const otp = Math.floor(
    10 ** (digit - 1) + Math.random() * (10 ** (digit - 1) * 9),
  );
  return otp;
};

exports.generateOtpToken = (data) => {
  const { expires_in, ...tokenData } = data;
  const options = { expiresIn: process.env.OTP_EXPIRES_IN };
  return jwt.sign(tokenData, process.env.SECRET_KEY, options);
};

const fileFilter = (req, file, cb) => {
  let filetype = "";
  if (file.mimetype === "image/png") filetype = "png";
  if (file.mimetype === "image/jpg") filetype = "jpg";
  if (file.mimetype === "image/jpeg") filetype = "jpeg";
  if (file.mimetype === "text/csv") filetype = "csv";
  if (file.mimetype === "application/pdf") filetype = "pdf";
  if (file.mimetype === "audio/mpeg") filetype = "mpeg";
  if (filetype) {
    cb(null, true);
  } else {
    cb({ code: "WRONG_FILE_TYPE", field: file.fieldname }, false);
  }
};

const fileCSVFilter = (req, file, cb) => {
  let filetype = "";
  if (file.mimetype === "text/csv") filetype = "csv";
  if (filetype) {
    cb(null, true);
  } else {
    cb({ code: "WRONG_FILE_TYPE", field: file.fieldname }, false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${appRoot}/app/public`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date().getTime();
    const ext = file.originalname.slice(
      ((file.originalname.lastIndexOf(".") - 1) >>> 0) + 2,
    );
    cb(null, uniqueSuffix + "." + ext);
  },
});

exports.uploadFile = (name) => async (req, res, next) => {
  const upload = multer({
    fileFilter,
    storage,
    limits: { fileSize: 1000000000 },
  }).single(name);
  upload(req, res, (error) => {
    if (error) {
      return response.error(
        req,
        res,
        { msgCode: error.code, data: error.field },
        httpStatus.BAD_REQUEST,
      );
    }
    next();
  });
};

exports.uploadCSVFile = (name) => async (req, res, next) => {
  const upload = multer({
    fileFilter: fileCSVFilter,
    limits: { fileSize: 1000000000 },
  }).single(name);
  upload(req, res, (error) => {
    if (error) {
      return response.error(
        req,
        res,
        { msgCode: error.code, data: error.field },
        httpStatus.BAD_REQUEST,
      );
    }
    next();
  });
};

exports.uploadFiles = (fields) => async (req, res, next) => {
  const upload = multer({
    fileFilter,
    storage,
    limits: { fileSize: 1000000000 },
  }).fields(fields);
  upload(req, res, (error) => {
    if (error) {
      return response.error(
        req,
        res,
        { msgCode: error.code, data: error.field },
        httpStatus.BAD_REQUEST,
      );
    }
    next();
  });
};

exports.deleteFile = async (filePath) => {
  filePath = path.join(appRoot, PUBLIC_FOLDER, filePath);
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
  });
};

exports.getFileUrl = (fileName) => {
  return path.join(appRoot, PUBLIC_FOLDER, fileName);
};

exports.removeDuplicates = (arr) => {
  const uniqueObjects = [];
  const seenNames = {};

  for (const obj of arr) {
    const name = obj.name;

    if (!seenNames[name]) {
      uniqueObjects.push(obj);
      seenNames[name] = true;
    }
  }

  return uniqueObjects;
};

exports.generatePassword = () => {
  const length = 8;
  const charsetLower = "abcdefghijklmnopqrstuvwxyz";
  const charsetUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charsetDigit = "0123456789";
  const charsetSpecial = "@$!%*?&";
  const charsetAll =
    charsetLower + charsetUpper + charsetDigit + charsetSpecial;

  let password = "";

  // Ensure at least one character from each required set
  password += charsetLower[Math.floor(Math.random() * charsetLower.length)];
  password += charsetUpper[Math.floor(Math.random() * charsetUpper.length)];
  password += charsetDigit[Math.floor(Math.random() * charsetDigit.length)];
  password += charsetSpecial[Math.floor(Math.random() * charsetSpecial.length)];

  // Fill the rest of the password length with random characters from all sets
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetAll.length);
    password += charsetAll[randomIndex];
  }

  // Shuffle the password to ensure randomness
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
};

exports.generateApplicationNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
