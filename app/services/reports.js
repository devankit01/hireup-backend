const csvWriter = require("csv-writer"); // Import the csv-writer package
// const appRoot = require('app-root-path'); // Import the app-root-path package

const roCsv = async (data) => {
  try {
    const path = `${appRoot}/app/public/${new Date().getTime()}.csv`;

    // Flatten the data structure to match CSV headers
    const flattenedData = data.map((theatre, index) => ({
      "Sno.": index + 1,
      "Company Name": theatre.Theatre.company
        ? theatre.Theatre.company.company_name
        : "",
      "Theatre Name": theatre.Theatre.theater_name,
      State: theatre.Theatre.state,
      City: theatre.Theatre.city,
      Screen: theatre.screen_number,
      "Show No.": theatre.show_number,
      "Video Name": theatre.Psa_Video.name,
      "Broadcast Date": theatre.date,
      "Psa Video Start Time": theatre.video_start_time,
      "Psa Video End Time": theatre.video_end_time,
    }));

    const writer = csvWriter.createObjectCsvWriter({
      path,
      header: [
        { id: "Sno.", title: "Sno." },
        { id: "Company Name", title: "Company Name" },
        { id: "Theatre Name", title: "Theatre Name" },
        { id: "State", title: "State" },
        { id: "City", title: "City" },
        { id: "Screen", title: "Screen" },
        { id: "Show No.", title: "Show No." },
        { id: "Video Name", title: "Video Name" },
        { id: "Broadcast Date", title: "Broadcast Date" },
        { id: "Psa Video Start Time", title: "Psa Video Start Time" },
        { id: "Psa Video End Time", title: "Psa Video End Time" },
      ],
    });

    await writer.writeRecords(flattenedData);
    return path;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const superAdminCompanyCsv = async (data) => {
  try {
    const path = `${appRoot}/app/public/${new Date().getTime()}.csv`;

    // Flatten the data structure to match CSV headers
    const flattenedData = data.map((record, index) => ({
      "S.No.": index + 1,
      "Entity Name": record.company_name,
      "Authorized Person Name": `${record.first_name} ${record.middle_name ? record.middle_name + " " : ""}${record.last_name}`,
      "PAN Number": record.PAN,
      "GSTIN Number": record.GSTIN,
      "Approved Date": record.approved_date_so || record.approved_date_ro,
      State: record.state,
    }));

    const writer = csvWriter.createObjectCsvWriter({
      path,
      header: [
        { id: "S.No.", title: "S.No." },
        { id: "Entity Name", title: "Entity Name" },
        { id: "Authorized Person Name", title: "Authorized Person Name" },
        { id: "PAN Number", title: "PAN Number" },
        { id: "GSTIN Number", title: "GSTIN Number" },
        { id: "Approved Date", title: "Approved Date" },
        { id: "State", title: "State" },
      ],
    });

    await writer.writeRecords(flattenedData);
    return path;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const superAdminTheaterCsv = async (data) => {
  try {
    const path = `${appRoot}/app/public/${new Date().getTime()}.csv`;

    // Flatten the data structure to match CSV headers
    const flattenedData = data.map((record, index) => ({
      "S.No.": index + 1,
      "Company Name": record.company ? record.company.company_name : "",
      "Theatre Name": record.theater_name,
      "No. of Screens": record.screens,
      State: record.state,
      City: record.city,
      "Pin Code": record.pin_code,
      "CBFC Office": record.Cbfc_Office ? record.Cbfc_Office.name : "",
      "View Payment Slip": record.receipt,
    }));

    const writer = csvWriter.createObjectCsvWriter({
      path,
      header: [
        { id: "S.No.", title: "S.No." },
        { id: "Company Name", title: "Company Name" },
        { id: "Theatre Name", title: "Theatre Name" },
        { id: "No. of Screens", title: "No. of Screens" },
        { id: "State", title: "State" },
        { id: "City", title: "City" },
        { id: "Pin Code", title: "Pin Code" },
        { id: "CBFC Office", title: "CBFC Office" },
        { id: "View Payment Slip", title: "View Payment Slip" },
      ],
    });

    await writer.writeRecords(flattenedData);
    return path;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const superAdminSoRoCsv = async (data) => {
  try {
    const path = `${appRoot}/app/public/${new Date().getTime()}.csv`;

    // Flatten the data structure to match CSV headers
    const flattenedData = data.map((entry, index) => ({
      "S.No.": index + 1,
      Name: entry.name,
      "Email Id": entry.email,
      "Phone Number": entry.contact_number ? entry.contact_number : "",
      "State / Region": entry.Region.name,
    }));

    const writer = csvWriter.createObjectCsvWriter({
      path,
      header: [
        { id: "S.No.", title: "S.No." },
        { id: "Name", title: "Name" },
        { id: "Email Id", title: "Email Id" },
        { id: "Phone Number", title: "Phone Number" },
        { id: "State / Region", title: "State / Region" },
      ],
    });

    await writer.writeRecords(flattenedData);
    return path;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const superAdminPsaVideoCsv = async (data) => {
  try {
    const path = `${appRoot}/app/public/${new Date().getTime()}.csv`;

    // Flatten the data structure to match CSV headers
    const flattenedData = data.map((video, index) => ({
      "S.No.": index + 1,
      "Name Of Video": video.name,
      "Short description of the video (in English)": video.description,
      "Valid From Date": new Date(video.valit_from).toLocaleDateString(),
      "Valid To Date": new Date(video.valit_to).toLocaleDateString(),
      "Video to be displayed": video.url,
    }));

    const writer = csvWriter.createObjectCsvWriter({
      path,
      header: [
        { id: "S.No.", title: "S.No." },
        { id: "Name Of Video", title: "Name Of Video" },
        {
          id: "Short description of the video (in English)",
          title: "Short description of the video (in English)",
        },
        { id: "Valid From Date", title: "Valid From Date" },
        { id: "Valid To Date", title: "Valid To Date" },
        { id: "Video to be displayed", title: "Video to be displayed" },
      ],
    });

    await writer.writeRecords(flattenedData);
    return path;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const theatrePsaDetailsCsv = async (data) => {
  try {
    const path = `${__dirname}/${new Date().getTime()}.csv`;

    // Flatten the data structure to match CSV headers
    const flattenedData = data.map((entry, index) => ({
      "Screen Number": entry.screen_number,
      "Video Name": entry.Psa_Video.name,
      Date: entry.date,
      "Show Number": entry.show_number,
      "Psa Video Start Time": entry.video_start_time,
      "Psa Video End Time": entry.video_end_time,
    }));

    const writer = csvWriter.createObjectCsvWriter({
      path,
      header: [
        { id: "Screen Number", title: "Screen Number" },
        { id: "Video Name", title: "Video Name" },
        { id: "Date", title: "Date" },
        { id: "Show Number", title: "Show Number" },
        { id: "Psa Video Start Time", title: "Psa Video Start Time" },
        { id: "Psa Video End Time", title: "Psa Video End Time" },
      ],
    });

    await writer.writeRecords(flattenedData);
    return path;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Export the service function
module.exports = {
  roCsv,
  superAdminCompanyCsv,
  superAdminTheaterCsv,
  superAdminSoRoCsv,
  superAdminPsaVideoCsv,
  theatrePsaDetailsCsv,
};
