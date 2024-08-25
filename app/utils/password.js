const bcrypt = require("bcrypt");
const { env } = require("../constant/environment");
const CryptoJS = require("crypto-js");
exports.generateHash = async (password) => {
  try {
    const saltRounds = parseInt(env.SALT_ROUND);
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password.toString(), salt);
    return hash;
  } catch (err) {
    return err;
  }
};
// you can compare hash otp by below function
exports.comparePassword = (password, hash) =>
  bcrypt.compareSync(password, hash);

exports.decryptData = (encryptedText) => {
  const key = "A$ecureStaticKeyWithDigits123&Symbols!@#";
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};
