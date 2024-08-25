const helper = require("../utils/helper");
const commonService = require("./common");
const passwordHash = require("../utils/password");
const { USER_TYPE, USER_STATUS } = require("../constant/auth");
const db = require("../models/index").sequelize;

// exports.finalApprovalOps = async(application, dbTrans)=>{
//     try {
//         const {Company_Details, Auth} = db.models
//         const password = helper.generatePassword()
//         const hashPass = await passwordHash.generateHash(password)
//         const authData = {
//             name:application.auth_person_name,
//             email: application.email,
//             contact_number : application.contact_number,
//             user_type: USER_TYPE.COMPANY,
//             password : hashPass,
//             status: USER_STATUS.PENDING
//         }

//         const email = authData.email
//         const authAdded = await commonService.addDetail(Auth, authData, dbTrans)
//         if (!authAdded) {
//             return false
//         }
//         // send email to user with id and password
//         // const sendData = {email, password, application_number : application.application_number}
//         return true

//     } catch (error) {
//         console.log(error);
//         return false
//     }
// }

exports.finalApprovalOps = async (applications, dbTrans) => {
  try {
    const { Company_Details, Auth } = db.models;
    const results = [];
    const emaiPassPairs = [];

    for (const application of applications) {
      const fullName = `${application.first_name} ${application.middle_name ? application.middle_name + " " : ""}${application.last_name}`;
      const password = helper.generatePassword();
      const hashPass = await passwordHash.generateHash(password);
      const authData = {
        name: fullName,
        email: application.email,
        contact_number: application.contact_number,
        user_id: application.user_id,
        user_type: USER_TYPE.COMPANY,
        password: hashPass,
        status: USER_STATUS.PASS_PENDING,
      };
      const email = authData.email;
      emaiPassPairs.push({ email, password });
      const authAdded = await commonService.addDetail(Auth, authData, dbTrans);
      if (!authAdded) {
        results.push({
          application_number: application.application_number,
          status: "failed",
        });
        continue;
      }

      // Optionally, send email to user with ID and password
      // const sendData = { email, password, application_number: application.application_number };
      // await emailService.sendEmail(sendData);

      results.push({
        application_number: application.application_number,
        status: "success",
      });
    }

    // Check if all operations were successful
    const allSuccessful = results.every(
      (result) => result.status === "success",
    );
    if (!allSuccessful) {
      console.log(
        "Some applications failed:",
        results.filter((result) => result.status === "failed"),
      );
      return false;
    }

    return emaiPassPairs;
  } catch (error) {
    console.log(error);
    return false;
  }
};
