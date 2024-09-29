const Joi = require("joi");
const { DEFAULT_VALUE_LIST, OTP, COMPANY_TYPE } = require("../constant/auth");
const { password, email } = require("./common");

exports.studentSignUp = Joi.object({
  name: Joi.string().required(),
  email: email,
  password: password,
  roll_number: Joi.string().required(),
  contact_number: Joi.string().required(),
  device_id: Joi.string().required(),
  college_id: Joi.string().required(),
  device_token: Joi.string().required(),

  device_type: Joi.string().default(DEFAULT_VALUE_LIST.DEVICE).optional(),
}).unknown(false);

exports.collegeSignUp = Joi.object({
  email: email,
  password: password,
  contact_number: Joi.string().required(),
  name: Joi.string().required(),
  college_code: Joi.number().required(),
  device_id: Joi.string().required(),
  state_id: Joi.string().required(),
  district_id: Joi.string().required(),
  pincode: Joi.string().optional(),
  address: Joi.string().required(),
  device_token: Joi.string().required(),
  address: Joi.string().required(),
  device_type: Joi.string().default(DEFAULT_VALUE_LIST.DEVICE).optional(),
}).unknown(false);

exports.companySignUp = Joi.object({
  email: email,
  password: password,
  contact_number: Joi.string().required(),
  name: Joi.string().required(),
  company_code: Joi.number().required(),
  company_type: Joi.string()
    .valid(...Object.values(COMPANY_TYPE))
    .required(),
  device_id: Joi.string().required(),
  device_token: Joi.string().required(),
  address: Joi.string().required(),
  state_id: Joi.string().required(),
  district_id: Joi.string().required(),
  pincode: Joi.string().optional(),
  device_type: Joi.string().default(DEFAULT_VALUE_LIST.DEVICE).optional(),
}).unknown(false);

exports.recruiterSignUp = Joi.object({
  email: email,
  password: password,
  contact_number: Joi.string().required(),
  name: Joi.string().required(),
  device_id: Joi.string().required(),
  company_id: Joi.string().required(),
  device_token: Joi.string().required(),
  device_type: Joi.string().default(DEFAULT_VALUE_LIST.DEVICE).optional(),
}).unknown(false);

exports.login = Joi.object({
  email: email,
  password: password,
  device_id: Joi.string().required(),
  device_token: Joi.string().required(),
  device_type: Joi.string().default(DEFAULT_VALUE_LIST.DEVICE).optional(),
}).unknown(false);

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
  //  logout: Joi.boolean(),
}).unknown(false);
