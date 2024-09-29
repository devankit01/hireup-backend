const response = require("../response");
const authJwt = require("../middleware");
const httpStatus = require("http-status");
const passwordHash = require("../utils/password");
const helper = require("../utils/helper");
const db = require("../models/index").sequelize;
const { env } = require("../constant/environment");
const {
  USER_STATUS,
  INVITATION_STATUS,
  USER_TYPE,
} = require("../constant/auth");
const commonService = require("../services/common");
const authMapper = require("../mapper/auth");
const messages = require("../response/lng/en.json");

exports.login = async (req, res, next) => {
  try {
    const { checkUser, dbTrans } = req.data;
    const { auths } = db.models;
    const { device_id, device_token, device_type, email } = req.body;

    const condition = { email };

    if (checkUser.login_attempts > 0) {
      const data = {
        login_attempts: 0,
      };
      await commonService.updateData(auths, data, condition, dbTrans);
    }

    const {
      password,
      status,
      approval,
      user_id,
      login_attempts,
      application_number,
      declaration_date,
      ...resultData
    } = checkUser;

    resultData.token = authJwt.generateAuthJwt({
      id: checkUser.id,
      user_id: checkUser.user_id,
      role: checkUser.role,
      email,
      device_id,
      approval: checkUser.approval,
      status: checkUser.status,
      expires_in: env.TOKEN_EXPIRES_IN,
    });
    resultData.refreshToken = authJwt.generateRefreshAuthJwt({
      id: checkUser.id,
      user_id: checkUser.user_id,
      role: checkUser.role,
      email,
      device_id,
      approval: checkUser.approval,
      status: checkUser.status,
      expires_in: env.REFRESH_TOKEN_EXPIRES_IN,
    });

    if (!resultData.token) {
      return response.error(
        req,
        res,
        { msgCode: "INTERNAL_SERVER_ERROR" },
        httpStatus.INTERNAL_SERVER_ERROR,
        dbTrans,
      );
    }
    // Passing login data to another middleware
    req.loginData = {
      dbTrans,
      device_details: { device_id, device_token, device_type },
      auth_details: resultData,
    };

    return next();
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.studentSignUp = async (req, res, next) => {
  const dbTrans = await db.transaction();
  try {
    req.body.password = await passwordHash.generateHash(req.body.password);
    req.body.role = USER_TYPE.STUDENT;
    const authObject = ({ email, password, contact_number, password, role } =
      req.body);
    const authDetails = await commonService.create(db.models.auths, authObject);
    req.body.auth_id = authDetails.toJSON().id;

    const createdStudent = await commonService.create(
      db.models.students,
      req.body,
    );
    const studentDetails = createdStudent.toJSON();

    studentDetails.token = authJwt.generateAuthJwt({
      auth_id: authDetails.toJSON().id,
      user_id: studentDetails.user_id,
      role: authDetails.toJSON().role,
      expires_in: env.TOKEN_EXPIRES_IN,
    });

    await this.insertSessionData(
      req.body,
      studentDetails.token,
      authDetails.toJSON().id,
    );
    const responseData = {
      data: authMapper.studentSignUpMapper(studentDetails),
      msgCode: messages.SIGNUP_SUCCESSFUL,
    };

    return response.success(
      req,
      res,
      responseData,
      httpStatus.CREATED,
      dbTrans,
    );
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.collegeSignUp = async (req, res, next) => {
  const dbTrans = await db.transaction();
  try {
    req.body.password = await passwordHash.generateHash(req.body.password);
    req.body.role = USER_TYPE.COLLEGE;
    const authObject = ({ email, password, contact_number, password, role } =
      req.body);
    const authDetails = await commonService.create(db.models.auths, authObject);
    req.body.auth_id = authDetails.toJSON().id;
    const createdCollege = await commonService.create(
      db.models.colleges,
      req.body,
    );
    const collegeDetails = createdCollege.toJSON();

    collegeDetails.token = authJwt.generateAuthJwt({
      auth_id: authDetails.toJSON().id,
      user_id: collegeDetails.user_id,
      role: authDetails.toJSON().role,
      expires_in: env.TOKEN_EXPIRES_IN,
    });

    await this.insertSessionData(
      req.body,
      collegeDetails.token,
      authDetails.toJSON().id,
    );
    const responseData = {
      data: authMapper.collegeSignUpMapper(collegeDetails),
      msgCode: messages.SIGNUP_SUCCESSFUL,
    };

    return response.success(
      req,
      res,
      responseData,
      httpStatus.CREATED,
      dbTrans,
    );
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.companySignUp = async (req, res, next) => {
  const dbTrans = await db.transaction();
  try {
    req.body.role = USER_TYPE.COMPANY;
    req.body.password = await passwordHash.generateHash(req.body.password);
    const authObject = ({ email, password, contact_number, password, role } =
      req.body);
    const authDetails = await commonService.create(db.models.auths, authObject);
    req.body.auth_id = authDetails.toJSON().id;
    const createdCompany = await commonService.create(
      db.models.companies,
      req.body,
    );
    const companyDetails = createdCompany.toJSON();

    companyDetails.token = authJwt.generateAuthJwt({
      auth_id: authDetails.toJSON().id,
      user_id: companyDetails.id,
      role: authDetails.toJSON().role,
      email: authDetails.toJSON().email,
      expires_in: env.TOKEN_EXPIRES_IN,
    });

    await this.insertSessionData(
      req.body,
      companyDetails.token,
      authDetails.toJSON().id,
    );
    const responseData = {
      data: authMapper.companySignUpMapper(companyDetails),
      msgCode: messages.SIGNUP_SUCCESSFUL,
    };

    return response.success(
      req,
      res,
      responseData,
      httpStatus.CREATED,
      dbTrans,
    );
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.recruiterSignUp = async (req, res, next) => {
  const dbTrans = await db.transaction();
  try {
    req.body.role = USER_TYPE.RECRUITER;
    req.body.password = await passwordHash.generateHash(req.body.password);
    const authObject = ({ email, password, contact_number, password, role } =
      req.body);
    const authDetails = await commonService.create(db.models.auths, authObject);
    req.body.auth_id = authDetails.toJSON().id;
    const createdRecruiter = await commonService.create(
      db.models.recruiters,
      req.body,
    );
    const recruiterDetails = createdRecruiter.toJSON();

    recruiterDetails.token = authJwt.generateAuthJwt({
      auth_id: authDetails.toJSON().id,
      user_id: recruiterDetails.id,
      role: authDetails.toJSON().role,
      expires_in: env.TOKEN_EXPIRES_IN,
    });

    await this.insertSessionData(
      req.body,
      recruiterDetails.token,
      authDetails.toJSON().id,
    );

    const responseData = {
      data: authMapper.recruiterSignUpMapper(recruiterDetails),
      msgCode: messages.SIGNUP_SUCCESSFUL,
    };

    return response.success(
      req,
      res,
      responseData,
      httpStatus.CREATED,
      dbTrans,
    );
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.createSession = async (req, res) => {
  const { dbTrans } = req.loginData;
  try {
    const { device_id, device_token, device_type } =
      req.loginData.device_details;
    const condition = { device_id };
    const { sessions } = await db.models;

    const checkSession = await commonService.findByCondition(
      sessions,
      condition,
    );

    if (checkSession) {
      const condition = { id: checkSession.id };

      // for hard delete true is required to pass in delete query
      const destroySession = await commonService.deleteQuery(
        sessions,
        condition,
        dbTrans,
        true,
      );
      if (!destroySession) {
        return response.error(
          req,
          res,
          { msgCode: helper.getErrorMsgCode(req) },
          httpStatus.INTERNAL_SERVER_ERROR,
          dbTrans,
        );
      }
    }

    const sessionData = {
      auth_id: req.loginData.auth_details.id,
      device_id,
      device_token,
      device_type,
      jwt_token: req.loginData.auth_details.token,
      refresh_token: req.loginData.auth_details.refreshToken,
    };

    const createSession = await commonService.addDetail(
      sessions,
      sessionData,
      dbTrans,
    );
    if (!createSession) {
      return response.error(
        req,
        res,
        { msgCode: helper.getErrorMsgCode(req) },
        httpStatus.INTERNAL_SERVER_ERROR,
        dbTrans,
      );
    }

    const { ...data } = req.loginData.auth_details;

    const msgCode = helper.getSuccessMsgCode(req);
    return response.success(
      req,
      res,
      { msgCode, data },
      httpStatus.OK,
      dbTrans,
    );
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.forgotPassword = async (req, res) => {
  const dbTrans = await db.transaction();
  try {
    const { auths, otps } = db.models;
    const { email } = req.body;

    const checkUser = await commonService.findByCondition(auths, { email });
    if (!checkUser) {
      return response.error(
        req,
        res,
        {
          msgCode:
            "Please enter valid email address, Email Id is not Registered",
        },
        httpStatus.NOT_FOUND,
        dbTrans,
      );
    }

    let otp = helper.generateOtp(env.OTP_DIGIT);
    otp = 123456;
    const hashOtp = await passwordHash.generateHash(otp);
    const condition = { user: email };

    const token = authJwt.generateAuthJwt({
      auth_id: checkUser.id,
      email,
      expires_in: env.OTP_EXPIRES_IN,
    });

    const checkOtp = await commonService.findByCondition(otps, condition);

    if (checkOtp) {
      // if condition match than we update otp in existing row
      const updateData = await commonService.updateData(
        otps,
        { otp: hashOtp },
        condition,
        dbTrans,
      );
      if (!updateData) {
        return response.error(
          req,
          res,
          { msgCode: "OTP_NOT_SEND" },
          httpStatus.FORBIDDEN,
          dbTrans,
        );
      }
    }

    const otpData = { name: checkUser.name, user: email, otp: hashOtp };

    const createOtpDetails = await commonService.addDetail(
      otps,
      otpData,
      dbTrans,
    );
    if (!createOtpDetails) {
      return response.error(
        req,
        res,
        { msgCode: "OTP_NOT_SEND" },
        httpStatus.FORBIDDEN,
        dbTrans,
      );
    }

    // const mailMessage = "Forgot Password";
    // const requiredPath = path.join(__dirname, "../template/resetPassword.ejs");
    // const template = await ejs.renderFile(requiredPath, { token, name: checkUser.name, otp })
    // await helper.sendMail({email, template, subject:mailMessage})
    // helper.sendMail(email, , mailMessage, mailTemplate);

    return response.success(
      req,
      res,
      {
        msgCode: "FORGOT_PASSWORD",
        data: { token: token, OTP: otp, email },
      },
      httpStatus.OK,
      dbTrans,
    );
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.verifyOtp = async (req, res, next) => {
  const dbTrans = await db.transaction();
  try {
    const { otps } = await db.models;
    const { email, otp } = req.body;
    const condition = { user: email };

    const { auth_id } = req.token;

    // get data from token
    const { ...tokenData } = req.token;
    if (tokenData.email !== email) {
      return response.error(
        req,
        res,
        { msgCode: "INVALID_EMAIL" },
        httpStatus.BAD_REQUEST,
        dbTrans,
      );
    }

    const details = await commonService.findByCondition(otps, condition);
    if (!details) {
      return response.error(
        req,
        res,
        { msgCode: "OTP_EXPIRED" },
        httpStatus.BAD_REQUEST,
        dbTrans,
      );
    }

    const check = passwordHash.comparePassword(otp, details.otp);
    if (!check) {
      return response.error(
        req,
        res,
        { msgCode: "INCORRECT_OTP" },
        httpStatus.BAD_REQUEST,
        dbTrans,
      );
    }

    const token = authJwt.generateAuthJwt({
      email,
      auth_id,
      expires_in: env.OTP_EXPIRES_IN,
    });

    if (!token) {
      return response.error(
        req,
        res,
        { msgCode: "EMAIL_v_FAILED" },
        httpStatus.FORBIDDEN,
        dbTrans,
      );
    }

    const deleteOtp = await commonService.deleteQuery(
      otps,
      condition,
      dbTrans,
      true,
    );
    if (!deleteOtp) {
      return response.error(
        req,
        res,
        { msgCode: "EMAIL_v_FAILED" },
        httpStatus.FORBIDDEN,
        dbTrans,
      );
    }

    const data = { token: token };
    return response.success(
      req,
      res,
      { msgCode: "OTP_VERIFIED", data },
      httpStatus.ACCEPTED,
      dbTrans,
    );
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.resetPassword = async (req, res) => {
  const dbTrans = await db.transaction();
  try {
    const { auths, sessions } = db.models;
    const { new_password, confirm_password } = req.body;

    // get data from token
    const { ...tokenData } = req.token;
    const { email, invitation_status } = req.token;

    const condition = { email };
    if (tokenData.email !== email) {
      return response.error(
        req,
        res,
        { msgCode: "INVALID_TOKEN" },
        httpStatus.UNAUTHORIZED,
        dbTrans,
      );
    }

    const userDetails = await commonService.findByCondition(auths, condition);
    if (!userDetails)
      return response.error(
        req,
        res,
        { msgCode: "USER_NOT_FOUND" },
        httpStatus.NOT_FOUND,
        dbTrans,
      );

    let newPassword = passwordHash.decryptData(new_password);
    if (!newPassword) {
      newPassword = req.body.new_password;
    }
    let confirmPassword = passwordHash.decryptData(confirm_password);
    if (!confirmPassword) {
      confirmPassword = req.body.confirm_password;
    }

    if (newPassword !== confirmPassword) {
      return response.error(
        req,
        res,
        { msgCode: "PASSWORD_NOT_MATCHED" },
        httpStatus.FORBIDDEN,
        dbTrans,
      );
    }

    const hashPassword = await passwordHash.generateHash(newPassword);
    const data = { password: hashPassword };
    if (invitation_status == INVITATION_STATUS.PENDING) {
      data.invitation_status = INVITATION_STATUS.ACCEPTED;
    }
    data.status = "active";
    const updateUser = await commonService.updateData(
      auths,
      data,
      condition,
      dbTrans,
    );
    if (updateUser.modifiedCount === 0)
      return response.error(
        req,
        res,
        { msgCode: "UPDATE_ERROR" },
        httpStatus.FORBIDDEN,
        dbTrans,
      );
    await commonService.deleteQuery(sessions, condition, dbTrans, true);

    return response.success(
      req,
      res,
      { msgCode: "PASSWORD_UPDATED" },
      httpStatus.CREATED,
      dbTrans,
    );
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.logout = async (req, res) => {
  const dbTrans = await db.transaction(); // Creating database transaction
  try {
    // auth id we get from token
    const condition = { auth_id: req.data.id, device_id: req.data.device_id };

    const { sessions } = await db.models;
    const destroySession = await commonService.deleteQuery(
      sessions,
      condition,
      dbTrans,
      true,
    );

    if (!destroySession) {
      return response.error(
        req,
        res,
        { msgCode: "USER_NOT_LOGOUT" },
        httpStatus.INTERNAL_SERVER_ERROR,
        dbTrans,
      );
    }
    return response.success(
      req,
      res,
      { msgCode: "LOGOUT_SUCCESSFUL" },
      httpStatus.OK,
      dbTrans,
    );
  } catch (error) {
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.resendOtp = async (req, res) => {
  const dbTrans = await db.transaction();
  try {
    const { auths, otps } = db.models;
    const { email } = req.body;
    let otp = helper.generateOtp(env.OTP_DIGIT);
    otp = 123456;
    const hashOtp = await passwordHash.generateHash(otp);
    const condition = { user: email };
    const emailExists = await commonService.findByCondition(auths, { email });
    if (!emailExists) {
      return response.error(
        req,
        res,
        { msgCode: "User not found" },
        httpStatus.FORBIDDEN,
        dbTrans,
      );
    }
    const token = authJwt.generateAuthJwt({
      auth_id: emailExists.id,
      email,
      expires_in: env.OTP_EXPIRES_IN,
    });

    const checkOtp = await commonService.findByCondition(otps, condition);

    if (checkOtp) {
      // if condition match than we update otp in existing row
      const updateData = await commonService.updateData(
        otps,
        { otp: hashOtp },
        condition,
        dbTrans,
      );
      if (!updateData) {
        return response.error(
          req,
          res,
          { msgCode: "OTP_NOT_SEND" },
          httpStatus.FORBIDDEN,
          dbTrans,
        );
      }
    }

    const otpData = { name: emailExists.name, user: email, otp: hashOtp };

    const createOtpDetails = await commonService.addDetail(
      otps,
      otpData,
      dbTrans,
    );

    if (!createOtpDetails) {
      return response.error(
        req,
        res,
        { msgCode: "OTP_NOT_SEND" },
        httpStatus.FORBIDDEN,
        dbTrans,
      );
    }

    // const mailMessage = "Resend OTP";
    // const requiredPath = path.join(__dirname, "../template/registration.ejs");
    // const template = await ejs.renderFile(requiredPath, { token, name: emailExists.name, otp })
    // await helper.sendMail({email, template, subject:mailMessage})

    return response.success(
      req,
      res,
      {
        msgCode: "OTP resend successfully",
        data: { token: token, OTP: otp, email },
      },
      httpStatus.OK,
      dbTrans,
    );
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.getAccessToken = async (req, res) => {
  const dbTrans = await db.transaction();
  try {
    const { sessions } = db.models;
    const token = authJwt.generateAuthJwt({
      id: req.data.id,
      role: req.data.role,
      expires_in: env.TOKEN_EXPIRES_IN,
      email: req.data.email,
      device_id: req.data.device_id,
      invitation_status: req.data.invitation_status,
      status: req.data.status,
    });
    const updateSession = await commonService.updateData(
      sessions,
      { jwt_token: token },
      { refresh_token: req.headers.refresh_token },
      dbTrans,
    );
    if (!updateSession) {
      return response.error(
        req,
        res,
        { msgCode: "UNAUTHORISED" },
        httpStatus.UNAUTHORIZED,
        dbTrans,
      );
    }
    return response.success(
      req,
      res,
      { msgCode: "SUCCESS", data: { token: token } },
      httpStatus.OK,
      dbTrans,
    );
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.checkUserStatus = async (req, res, next) => {
  try {
    const { auths } = db.models;
    const { email } = req.body;

    const condition = {
      email,
    };
    const checkUser = await commonService.findByCondition(auths, condition);
    if (!checkUser) {
      return response.error(
        req,
        res,
        { msgCode: "USER_NOT_FOUND" },
        httpStatus.UNAUTHORIZED,
      );
    }
    if (!checkUser?.password) {
      return response.error(
        req,
        res,
        { msgCode: "USER_NOT_FOUND_PLEASE_SIGNUP" },
        httpStatus.UNAUTHORIZED,
      );
    }

    const currentTime = new Date();
    const updatetedAt = new Date(checkUser.updated_at);
    const timeDifferenceMinutes = Math.floor(
      (currentTime - updatetedAt) / (1000 * 60),
    );

    if (checkUser.login_attempts > 5 && timeDifferenceMinutes <= 60) {
      return response.error(
        req,
        res,
        {
          msgCode: "MAX_LOGIN_ATTEMPTS",
          data:
            "Too Many Attempts Please Try After " +
            (60 - timeDifferenceMinutes) +
            " Minutes",
        },
        httpStatus.UNAUTHORIZED,
      );
    }
    req.data = { checkUser };
    return next();
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.matchUserPassword = async (req, res, next) => {
  const dbTrans = await db.transaction();
  try {
    const { checkUser } = req.data;
    const { auths } = db.models;
    const { email } = req.body;

    const condition = { email };

    let password = passwordHash.decryptData(req.body.password);
    if (!password) {
      password = req.body.password;
    }
    const isLogin = passwordHash.comparePassword(password, checkUser.password);
    if (!isLogin) {
      const count = checkUser.login_attempts + 1;
      const data = {
        login_attempts: count,
      };
      await commonService.updateData(auths, data, condition, dbTrans);
      return response.error(
        req,
        res,
        { msgCode: "INVALID_CREDENTIALS", data: "Invalid Credentials." },
        httpStatus.UNAUTHORIZED,
        dbTrans,
      );
    }
    req.data.dbTrans = dbTrans;
    return next();
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.checkUserTotalLogin = async (req, res, next) => {
  try {
    const { sessions } = db.models;
    const { checkUser } = req.data;

    const totalLogin = await commonService.count(sessions, {
      auth_id: checkUser.id,
    });
    if (totalLogin > env.MAX_LOGIN_DEVICE) {
      return response.error(
        req,
        res,
        { msgCode: "TOTAL_LOGIN" },
        httpStatus.UNAUTHORIZED,
        dbTrans,
      );
    }
    return next();
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.checkUserEmailExists = async (req, res, next) => {
  try {
    const { auths } = db.models;
    const { email } = req.body;

    const condition = {
      email,
    };
    const checkUser = await commonService.findByCondition(auths, condition);
    if (checkUser) {
      return response.error(
        req,
        res,
        { msgCode: "User already exists with this email" },
        httpStatus.BAD_REQUEST,
      );
    }
    return next();
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.checkUserPhoneExists = async (req, res, next) => {
  try {
    const { auths } = db.models;
    const { contact_number } = req.body;

    const checkUser = await commonService.findByCondition(auths, {
      contact_number,
    });
    if (checkUser) {
      return response.error(
        req,
        res,
        { msgCode: "User already exists with this contact number" },
        httpStatus.BAD_REQUEST,
      );
    }
    return next();
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.checkCollegeExists = async (req, res, next) => {
  try {
    const { colleges } = db.models;
    const { college_id } = req.body;

    const condition = {
      id: college_id,
    };
    const collegeDetails = await commonService.findByCondition(
      colleges,
      condition,
    );
    if (!collegeDetails) {
      return response.error(
        req,
        res,
        { msgCode: "Given college does not exists" },
        httpStatus.BAD_REQUEST,
      );
    }

    req.college = collegeDetails;
    return next();
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.checkCompanyExists = async (req, res, next) => {
  try {
    const { companies } = db.models;
    const { company_id } = req.body;

    const condition = {
      id: company_id,
    };
    const companyDetails = await commonService.findByCondition(
      companies,
      condition,
    );
    if (!companyDetails) {
      return response.error(
        req,
        res,
        { msgCode: "Given company does not exists" },
        httpStatus.BAD_REQUEST,
      );
    }

    req.company = companyDetails;
    return next();
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.insertSessionData = async (requestBody, token, authId) => {
  const dbTrans = await db.transaction();
  try {
    const sessionData = {
      auth_id: authId,
      jwt_token: token,
      device_id: requestBody.device_id,
      device_token: requestBody.device_token,
      device_type: requestBody.device_type,
    };

    return await commonService.create(db.models.sessions, sessionData);
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
      dbTrans,
    );
  }
};

exports.checkDistrictExists = async (req, res, next) => {
  try {
    const { districts } = db.models;
    const { district_id } = req.body;

    const condition = {
      id: district_id,
    };
    const districtDetails = await commonService.findByCondition(
      districts,
      condition,
    );
    if (!districtDetails) {
      return response.error(
        req,
        res,
        { msgCode: "District does not exists" },
        httpStatus.BAD_REQUEST,
      );
    }

    req.district = districtDetails;
    return next();
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.checkStateExists = async (req, res, next) => {
  try {
    const { states } = db.models;
    const { state_id } = req.body;

    const condition = {
      id: state_id,
    };
    const stateDetails = await commonService.findByCondition(states, condition);
    if (!stateDetails) {
      return response.error(
        req,
        res,
        { msgCode: "State does not exists" },
        httpStatus.BAD_REQUEST,
      );
    }
    req.state = stateDetails;
    return next();
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

exports.changePassword = async (req, res, next) => {
  const dbTrans = await await db.transaction();
  try {
    const { oldPassword, newPassword } = req.body;
    const { auth_id } = req.token;
    console.log(req.token);
    const authDetails = await commonService.findByCondition(db.models.auths, {
      id: auth_id,
    });
    const isCorrectPassword = passwordHash.comparePassword(
      oldPassword,
      authDetails.password,
    );

    if (!isCorrectPassword) {
      return response.error(
        req,
        res,
        { msgCode: "Old password is not correct" },
        httpStatus.BAD_REQUEST,
      );
    }
    const password = await passwordHash.generateHash(newPassword);
    await commonService.updateData(
      db.models.auths,
      { password },
      { id: auth_id },
    );

    return response.success(
      req,
      res,
      { msgCode: "Password changed successfully" },
      httpStatus.OK,
      dbTrans,
    );
  } catch (error) {
    console.log(error);
    return response.error(
      req,
      res,
      { msgCode: "INTERNAL_SERVER_ERROR" },
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
