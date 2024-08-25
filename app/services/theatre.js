const { Op } = require("sequelize");
const moment = require("moment");
const db = require("../models").sequelize; // Adjust the path as needed
// const commonService = require('../services/commonService'); // Adjust the path as needed

const commonService = require("./common");
const copyMappingsFromPreviousDay = async (theatreId) => {
  try {
    console.log("previous day");
    const { Psa_Video_Theatre_Mapping, Psa_Videos } = db.models;

    const previousDay = moment().subtract(1, "days").startOf("day").toDate();
    const previousDayEnd = moment().subtract(1, "days").endOf("day").toDate();

    const today = moment().startOf("day").toDate();

    const previousDayMappings = await Psa_Video_Theatre_Mapping.findAll({
      where: {
        theatre_id: theatreId,
        date: {
          [Op.between]: [previousDay, previousDayEnd],
        },
      },
      include: [
        {
          model: Psa_Videos,
          attributes: ["id", "name"],
        },
      ],
    });
    if (!previousDayMappings.length) {
      return false;
    }

    // Create new mappings with today's date
    const newMappings = previousDayMappings.map((mapping) => ({
      ...mapping.toJSON(),
      date: today,
      created_at: moment().format(),
      updated_at: moment().format(),
      deleted_at: null,
    }));

    return { count: newMappings.length, rows: newMappings };
  } catch (error) {
    console.error(error);
    return false;
  }
};

const copyMappingsFromPreviousWeek = async (theatreId) => {
  try {
    const { Psa_Video_Theatre_Mapping, Psa_Videos, Theatre } = db.models;
    // Get the date 7 days ago
    const startDate = moment().subtract(7, "days").startOf("day").toDate();
    const endDate = moment().subtract(1, "days").endOf("day").toDate();
    // Get today's date
    const today = moment().startOf("day").toDate();

    // Fetch mappings from the previous week
    const previousWeekMappings = await Psa_Video_Theatre_Mapping.findAll({
      where: {
        theatre_id: theatreId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Psa_Videos,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!previousWeekMappings.length) {
      return false;
    }

    // Create new mappings with today's date
    const newMappings = previousWeekMappings.map((mapping) => ({
      ...mapping.toJSON(),
      date: today,
      created_at: moment().format(),
      updated_at: moment().format(),
      deleted_at: null,
    }));

    return { count: newMappings.length, rows: newMappings };
  } catch (error) {
    console.error(error);
    return false;
  }
};

const existingTheatres = async (theatreData) => {
  try {
    const { Auth, Theatre, Company_Details } = db.models;

    // Extract arrays of user_id, email, and contact_number
    const userIds = theatreData.map((theatre) => theatre.user_id);
    const emails = theatreData.map((theatre) => theatre.email);
    const contactNumbers = theatreData.map((theatre) => theatre.contact_number);

    // Define conditions for the query
    const condition = {
      [Op.or]: [
        { user_id: { [Op.in]: userIds } },
        { email: { [Op.in]: emails } },
        { contact_number: { [Op.in]: contactNumbers } },
      ],
    };

    // Check in Auth table
    const authResults = await commonService.findByCondition(Auth, condition);

    // Check in Theatre table
    const theatreResults = await commonService.findByCondition(
      Theatre,
      condition,
    );

    // Check in Company_Details table
    const companyResults = await commonService.findByCondition(
      Company_Details,
      condition,
    );

    // Combine all results to find existing records
    const authArray = authResults ? [authResults] : [];
    const theatreArray = theatreResults ? [theatreResults] : [];
    const companyArray = companyResults ? [companyResults] : [];

    // Combine all results to find existing records
    const existingRecords = [...authArray, ...theatreArray, ...companyArray];
    // Return the existing records
    return existingRecords;
  } catch (error) {
    console.log(error);
    throw error; // Optionally rethrow the error to handle it at a higher level
  }
};

module.exports = {
  copyMappingsFromPreviousDay,
  copyMappingsFromPreviousWeek,
  existingTheatres,
};
