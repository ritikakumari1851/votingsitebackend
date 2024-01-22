const nodemailer = require("nodemailer");
const { emailConfig } = require("../../config/config");


exports.sendEmail = async (req, res) => {
  try {
    const transport = nodemailer.createTransport(emailConfig);
    const data = {
      from: "voteonclick@gmail.com",
      to: req.body.email,
      subject: req.subject,
      text: req.text,
    };

    transport.sendMail(data, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).json({ message: "Email Delivery Error" });
      } else {
        console.log(info);
        res.status(201).json({ message: "Success" });
      }
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
