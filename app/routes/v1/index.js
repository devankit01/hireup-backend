const app = require("express")();
const { verifyApiKey } = require("../../middleware/auth");

app.use(verifyApiKey);
app.use("/auth", require("./auth"));
app.use("/common", require("./common"));

module.exports = app;
