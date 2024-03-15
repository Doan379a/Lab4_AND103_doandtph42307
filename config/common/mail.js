var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "doandtph42307@fpt.edu.vn", pass: "pruh bgqs vopb cfqu" },
});
module.exports = transporter;
