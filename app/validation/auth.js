const Joi = require("joi");
const { DEFAULT_VALUE_LIST, OTP, COMPANY_TYPE } = require("../constant/auth");
const { password, email } = require("./common");

exports.studentSignUp = Joi.object({
  name: Joi.string().required(),
  email: email,
  password: password,
  roll_number: Joi.string().required(),
  contact_number: Joi.string().required(),
  college_name: Joi.string().required(),
  device_id: Joi.string().required(),
  device_token: Joi.string().required(),
  device_type: Joi.string().default(DEFAULT_VALUE_LIST.DEVICE).optional(),
});

exports.collegeSignUp = Joi.object({
  email: email,
  password: password,
  contact_number: Joi.string().required(),
  college_name: Joi.string().required(),
  college_code: Joi.number().required(),
  device_id: Joi.string().required(),
  device_token: Joi.string().required(),
  address: Joi.string().required(),
  device_type: Joi.string().default(DEFAULT_VALUE_LIST.DEVICE).optional(),
});

exports.companySignUp = Joi.object({
  email: email,
  password: password,
  contact_number: Joi.string().required(),
  company_name: Joi.string().required(),
  company_code: Joi.number().required(),
  company_type: Joi.string()
    .valid(...Object.values(COMPANY_TYPE))
    .required(),
  device_id: Joi.string().required(),
  device_token: Joi.string().required(),
  address: Joi.string().required(),
  device_type: Joi.string().default(DEFAULT_VALUE_LIST.DEVICE).optional(),
});

exports.recruiterSignUp = Joi.object({
  email: email,
  password: password,
  contact_number: Joi.string().required(),
  name: Joi.string().required(),
  device_id: Joi.string().required(),
  device_token: Joi.string().required(),
  device_type: Joi.string().default(DEFAULT_VALUE_LIST.DEVICE).optional(),
});

exports.login = Joi.object({
  email: email,
  password: password,
  device_id: Joi.string().required(),
  device_token: Joi.string().required(),
  device_type: Joi.string().default(DEFAULT_VALUE_LIST.DEVICE).optional(),
});

// You can change it according to requirements
exports.sendOtp = Joi.object({
  email: email,
});

exports.forgotPassword = Joi.object({
  email: email,
});

exports.verifyOtp = Joi.object({
  email: email,
  otp: Joi.string().length(OTP.LENGTH).message(OTP.MSG).required(),
});

exports.resetPassword = Joi.object({
  new_password: password,
  confirm_password: password,
});

exports.changePassword = Joi.object({
  oldPassword: password,
  newPassword: password,
  logout: Joi.boolean(),
});
