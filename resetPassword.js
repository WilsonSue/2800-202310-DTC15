const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

// render the reset password page
router.get("/resetPassword", (req, res) => {
  res.render("resetPassword");
});

// create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// testing the transporter
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("ready to send messages");
  }
});

router.post("/resetPassword", async (req, res) => {
  const { email } = req.body;
});

module.exports = router;
