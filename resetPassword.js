const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const NodeCache = require("node-cache");
const cache = new NodeCache({ checkperiod: 1200 });
const { database } = require("./databaseConnection");
require("dotenv").config();

const userCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("users");

// render the reset password page
router.get("/resetPassword", (req, res) => {
  res.render("resetPassword");
});

// handle the password reset link
router.get("/resetPassword/:token", (req, res) => {
  const { token } = req.params;
  const recipient = cache.get(token);
  console.log("Token:", token);
  console.log("Recipient:", recipient);

  if (!recipient) {
    // invalid or expired token
    const errorMessage = "Invalid or expired password reset link.";
    res.render("resetPassword", { errorMessage });
    return;
  }

  // render the password reset form
  res.render("resetPassword", { token });
});

router.post("/resetPassword", async (req, res) => {
  const { recipient } = req.body;
  const user = await userCollection.findOne({ email: recipient });

  if (!user) {
    // email address not found in the database
    const errorMessage =
      "The email address is not registered. Please try again or sign up to create an account.";
    const signupLink = "/signup";
    res.render("resetPassword", { errorMessage, signupLink });
    return;
  }

  try {
    const currentUrl = "https://encouraging-lime-wrap.cyclic.app/resetPassword";
    // const currentUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    const uniqueString = uuidv4();
    cache.set(uniqueString, recipient, 60 * 60 * 1000); // cache for 1 hour
    await sendEmail(recipient, currentUrl, uniqueString);
    const emailSent =
      "An email with instructions to reset your password has been sent to your registered email address. Please check your inbox and follow the provided link to reset your password.";
    res.render("resetPassword", { emailSent });
  } catch (error) {
    console.error(error);
    const errorMessage = "Failed to send email. Please try again later.";
    res.render("resetPassword", { errorMessage });
  }
});

// handle the password reset form submission
router.post("/resetPassword/:token", async (req, res) => {
  const { token } = req.params;
  const recipient = cache.get(token);

  if (!recipient) {
    // Invalid or expired token
    const errorMessage = "Invalid or expired password reset link.";
    res.render("resetPassword", { errorMessage });
    return;
  }

  const { newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    // update the user password in the database
    await userCollection.updateOne(
      { email: recipient },
      { $set: { password: hashedPassword } }
    );

    cache.del(token); // delete the token from the cache
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    const errorMessage = "Failed to reset password. Please try again later.";
    res.render("resetPassword", { errorMessage });
  }
});

async function sendEmail(recipient, currentUrl, uniqueString) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"Techommend" <${process.env.EMAIL_ADDRESS}>`,
    to: recipient,
    subject: "Password Reset Request",
    html: `
        <h1>Techommend</h1>
        <p>To reset your password, click on the link below:</p>
        <a href="${currentUrl}/${uniqueString}">Reset Password</a>
      `,
  });
}

module.exports = router;
