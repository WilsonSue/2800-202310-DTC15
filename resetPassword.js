const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

// render the reset password page
router.get("/resetPassword", (req, res) => {
  res.render("resetPassword");
});

async function main() {
  // create a transporter using Gmail SMTP
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define and send message inside transporter.sendEmail() and await info about send from promise:
  let info = await transporter.sendMail({
    from: `"DTC 15" <${process.env.EMAIL_ADDRESS}>`,
    to: "comp2800dtc15@gmail.com",
    subject: "test resetting password link",
    html: `
    <h1>Hello</h1>
    <p>test </p>
    `,
  });

  console.log(info.messageId); // log message id
}

main().catch((err) => console.log(err)); // catch any errors

router.post("/resetPassword", async (req, res) => {
  const { email } = req.body;
});

module.exports = router;
