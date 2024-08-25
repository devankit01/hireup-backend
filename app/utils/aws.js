const AWS = require("aws-sdk");
const fs = require("fs");
const https = require("https");
const { env } = require("../constant/environment");

AWS.config.update({
  accessKeyId: env.ACCESS_KEY,
  secretAccessKey: env.SECRET_KEY,
  endpoint: env.END_POINT, // Replace with the endpoint of your S3-compatible storage service
  s3ForcePathStyle: env.S3_FORCE_PATH_STYLE, // Necessary if your S3-compatible service does not support virtual hosted-style addressing
});

const uploadFile = async (name, filePath, mimetype, fileType) => {
  try {
    let key;
    if (fileType == "license") {
      key = env.LICENSE_FOLDER + name;
    } else if (fileType == "audio") {
      key = env.AUDIO_FOLDER + name;
    }
    // Define parameters for the upload
    const uploadParams = {
      Bucket: env.BUCKET,
      Key: key,
      Body: fs.createReadStream(filePath),
      ACL: env.ACL,
      ContentType: mimetype,
    };
    const agent = new https.Agent({
      rejectUnauthorized: false, // Allow self-signed certificates (not recommended for production)
    });

    // Configure AWS SDK with custom HTTPS agent
    const s3 = new AWS.S3({
      httpOptions: {
        agent,
      },
    });

    let fileUrl;
    // Upload the file
    const uploadPromise = new Promise((resolve, reject) => {
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          console.error("Error uploading file:", err);
          reject(new Error("Error uploading file: " + err.message)); // Reject the promise if there's an error
        } else {
          console.log("File uploaded successfully. Location:", data.Location);
          fileUrl = data.Location;
          resolve(data); // Resolve the promise with the upload data
        }
      });
    });

    // Wait for the promise to resolve or reject
    await uploadPromise;
    return fileUrl; // Indicate successful upload
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteFile = async (name, fileType) => {
  try {
    // Define parameters for the delete operation
    const agent = new https.Agent({
      rejectUnauthorized: false, // Allow self-signed certificates (not recommended for production)
    });

    // Configure AWS SDK with custom HTTPS agent
    const s3 = new AWS.S3({
      httpOptions: {
        agent,
      },
    });
    let key;
    if (fileType == "license") {
      key = env.LICENSE_FOLDER + name;
    } else if (fileType == "audio") {
      key = env.AUDIO_FOLDER + name;
    }
    const deleteParams = {
      Bucket: env.BUCKET,
      Key: key,
    };

    // Delete the file
    const deletePromise = new Promise((resolve, reject) => {
      s3.deleteObject(deleteParams, (err, data) => {
        if (err) {
          console.error("Error deleting file:", err);
          reject(new Error("Error deleting file: " + err.message)); // Reject the promise if there's an error
        } else {
          console.log("File deleted successfully.");
          resolve(data); // Resolve the promise with the delete data
        }
      });
    });

    // Wait for the promise to resolve or reject
    await deletePromise;
    return true; // Indicate successful deletion
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { uploadFile, deleteFile };
