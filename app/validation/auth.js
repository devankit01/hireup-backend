const Joi = require("joi");
const { DEFAULT_VALUE_LIST, OTP, PHONE } = require("../constant/auth");
const { password, email, requiredId } = require("./common");
const { REGEX_PATTERN } = require("../constant/common");

const crsRegistration = Joi.object({
  name: Joi.string().min(3).max(100).trim().required(),
  email: email,
  contact_number: Joi.string().length(10).trim().required(),
  country_code: Joi.string().trim().default("+91"),
  state_id: requiredId,
  district_id: requiredId,
  pincode: Joi.string().trim().min(1).max(6).required(),
  address: Joi.string().trim().required(),
  organization_name: Joi.string().min(3).max(100).trim().required(),
  license_number: Joi.string().trim().min(1).max(25).required(),
  license_link: Joi.string().trim().required(),
  license_name: Joi.string().required(),
  license_type: Joi.string().trim().required(),
  user_id: Joi.string().trim().required(),
  password: password,
});

const login = Joi.object({
  email: email,
  password: password,
  device_id: Joi.string().required(),
  device_token: Joi.string().required(),
  device_type: Joi.string().default(DEFAULT_VALUE_LIST.DEVICE).optional(),
});

// You can change it according to requirements

const sendOtp = Joi.object({
  email: email,
});

const forgotPassword = Joi.object({
  email: email,
});

const verifyOtp = Joi.object({
  email: email,
  otp: Joi.string().length(OTP.LENGTH).message(OTP.MSG).required(),
});

const resetPassword = Joi.object({
  new_password: password,
  confirm_password: password,
});

const changePassword = Joi.object({
  oldPassword: password,
  newPassword: password,
  logout: Joi.boolean(),
});

const getCRSApplication = Joi.object({
  application_number: Joi.string().trim().required(),
});

module.exports = {
  crsRegistration,
  login,
  sendOtp,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  getCRSApplication,
};
