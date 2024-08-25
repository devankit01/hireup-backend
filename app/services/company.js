const { USER_TYPE, USER_STATUS } = require("../constant/auth");
const helper = require("../utils/helper");
const { generateHash } = require("../utils/password");
const db = require("../models/index").sequelize;

exports.setUniqueApplicationNumber = async (companyDetails, crsDetails) => {
  let isUnique = false;
  let application_number = null;

  while (!isUnique) {
    application_number = helper.generateApplicationNumber();
    const existingCompany = await companyDetails.findOne({
      where: { application_number },
    });

    if (!existingCompany) {
      isUnique = true;
    }
  }

  return {
    application_number,
    declaration_date: crsDetails.declaration_date || Date.now(),
  };
};

exports.addTheatres = async (theatreData, dbTrans) => {
  try {
    const { Theatre } = db.models;
    const newTheatres = await Theatre.bulkCreate(
      theatreData.map((theatre) => {
        const { documents, ...theatreDetails } = theatre;
        return theatreDetails;
      }),
      { transaction: dbTrans },
    );
    if (!newTheatres) {
      return false;
    }
    return newTheatres;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.addTheatreDocs = async (theatreData, newTheatre, dbTrans) => {
  try {
    const { Theatre_Doc } = db.models;
    const theatreDocs = [];
    theatreData.forEach((theatre, index) => {
      theatre.documents.forEach((doc) => {
        theatreDocs.push({
          ...doc,
          company_id: newTheatre[index].id,
        });
      });
    });
    const theatreDocsAdded = await Theatre_Doc.bulkCreate(theatreDocs, {
      transaction: dbTrans,
    });
    if (!theatreDocsAdded) {
      return false;
    }
    return theatreDocsAdded;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.createAuth = async (theatreList, dbTrans) => {
  try {
    const { Auth } = db.models;
    const authPayload = [];
    const emailPasswordPairs = [];

    for (const theatre of theatreList) {
      const plainPassword = helper.generatePassword();
      const hashedPassword = await generateHash(plainPassword);
      const fullName = `${theatre.first_name} ${
        theatre.middle_name ? theatre.middle_name + " " : ""
      }${theatre.last_name}`;
      const authRecord = {
        name: fullName,
        email: theatre.email,
        password: hashedPassword,
        user_type: USER_TYPE.THEATRE,
        status: USER_STATUS.PASS_PENDING,
        contact_number: theatre.contact_number,
        user_id: theatre.user_id,
      };

      authPayload.push(authRecord);
      emailPasswordPairs.push({
        email: theatre.email,
        password: plainPassword,
      });
    }

    // Bulk create the auth records
    const newAuthRecords = await Auth.bulkCreate(authPayload, {
      transaction: dbTrans,
    });
    if (!newAuthRecords) {
      return false;
    }
    return { newAuthRecords, emailPasswordPairs };
  } catch (error) {
    console.log(error);
    return false;
  }
};
