require("dotenv").config();

const env = {
  PORT: process.env.PORT, // port on which server is running
  NODE_ENV: process.env.NODE_ENV, // environment of server
  API_KEY: process.env.API_KEY, // api-key of server
  SECRET_KEY: process.env.SECRET_KEY, // jwt token secret key
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN, // token expiration for jwt
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN, // refresh token expiration
  OTP_DIGIT: process.env.OTP_DIGIT, // length of otp
  SALT_ROUND: process.env.SALT_ROUND, // salt rounds for hashing. suggested - 10
  OTP_EXPIRES_IN: process.env.OTP_EXPIRES_IN, // otp token expiration
  MAX_LOGIN_DEVICE: process.env.MAX_LOGIN_DEVICE, // max logins per device
  DB_HOST: process.env.DB_HOST, // db host
  DB_NAME: process.env.DB_NAME, // db name
  DB_USER: process.env.DB_USER, // db user
  DB_PASSWORD: process.env.DB_PASSWORD, // db password
  PAGE: process.env.PAGE, // page = 1
  LIMIT: process.env.LIMIT, // size = 10
  SMTP_HOST: process.env.SMTP_HOST, // smtp host
  SMTP_PORT: process.env.SMTP_PORT, // smtp port
  SMTP_USER: process.env.SMTP_USER, // smtp user
  SMTP_PASSWORD: process.env.SMTP_PASSWORD, // smtp password
  ACCESS_KEY: process.env.ACCESS_KEY, // s3 access key
  END_POINT: process.env.END_POINT, // s3 endpoint
  S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE,
  BUCKET: process.env.BUCKET, // bucket name
  LICENSE_FOLDER: process.env.LICENSE_FOLDER,
  AUDIO_FOLDER: process.env.AUDIO_FOLDER,
  ACL: process.env.ACL,
  AUDIO_URL: process.env.AUDIO_URL,
  LICENSE_URL: process.env.LICENSE_URL,
  BULK_IMPORT: process.env.BULK_IMPORT,
};

module.exports = { env };
