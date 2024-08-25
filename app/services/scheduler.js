const { USER_TYPE, USER_STATUS } = require("../constant/auth");
const helper = require("../utils/helper");
const { generateHash } = require("../utils/password");
const db = require("../models/index").sequelize;
const commonService = require("./common");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const { Op } = require("sequelize");
const { BOOLEAN_VAL } = require("../constant/common");

const getPendingUser = async () => {
  try {
    console.log("inside scheduler");
    const { Auth } = db.models;
    const condition = {
      [Op.or]: [
        { user_type: USER_TYPE.COMPANY }, // Replace 'desired_user_type' with the actual user type you want to filter
        { user_type: USER_TYPE.THEATRE }, // Replace 'desired_company' with the actual company you want to filter
      ],
    };
    condition.status = USER_STATUS.PASS_PENDING;

    const authList = await commonService.getList(Auth, condition, [
      "email",
      "contact_number",
      "id",
      "name",
    ]);
    console.log(authList);
    if (authList.count == 0) {
      return false;
    }
    const emailList = authList.rows.map((auth) => auth.email);
    const password = "abcdefrg";
    const requiredPath = path.join(__dirname, "../template/sendMailPass.ejs");
    for (let obj of authList.rows) {
      const template = await ejs.renderFile(requiredPath, {
        loginLink: `http://13.127.37.201/admin/login?email=${obj.email}`,
        name: obj.name,
        email: obj.email,
        password: password,
      });
      helper.sendMail({ email: obj.email, template, subject: "Invitaion" });
    }
    return emailList;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getSchedulerTime = async () => {
  try {
    const { Scheduler_Timeline } = db.models;
    let time = 1;
    let last_run_date;
    const getTime = await commonService.findByCondition(Scheduler_Timeline);
    if (getTime) {
      (time = getTime.day), (last_run_date = getTime.last_run_date);
    }
    const cronExpression = { time, last_run_date };
    console.log(cronExpression);
    return cronExpression;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const upateLastRunTime = async (data) => {
  try {
    const { Scheduler_Timeline } = db.models;
    const updatedLastTime = await commonService.updateData(
      Scheduler_Timeline,
      data,
      {},
    );
    if (!updatedLastTime[0]) {
      console.log("last run time not updated");
      return false;
    }
    console.log("last run time updated for cron");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const videoArchiveCron = async () => {
  try {
    const { Psa_Videos } = db.models;
    const data = {
      is_archived: BOOLEAN_VAL.TRUE,
      is_deleted: BOOLEAN_VAL.FALSE,
      is_published: BOOLEAN_VAL.FALSE,
    };
    const currentDate = new Date();

    const condition = {
      is_deleted: BOOLEAN_VAL.FALSE,
      valit_to: {
        [Op.lt]: currentDate,
      },
    };

    const archivedPsaVideos = await commonService.updateData(
      Psa_Videos,
      data,
      condition,
    );
    if (!archivedPsaVideos[0]) {
      console.log("No videos archived");
      return false;
    }
    console.log("Videos archived successfully");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  getPendingUser,
  getSchedulerTime,
  videoArchiveCron,
  upateLastRunTime,
};
