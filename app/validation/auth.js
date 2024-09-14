const Joi = require("joi");
const { DEFAULT_VALUE_LIST, OTP } = require("../constant/auth");
const { password, email } = require("./common");

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
