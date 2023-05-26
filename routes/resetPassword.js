// Import required modules
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const NodeCache = require("node-cache");
const cache = new NodeCache({ checkperiod: 1200 });
const { database } = require("../databaseConnection");
require("dotenv").config();

// Get the 'users' collection from the MongoDB database
const userCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("users");

// Set up GET route for the reset password page
router.get("/resetPassword", (req, res) => {
  res.render("resetPassword");
});

// Handle the GET route for the password reset link
router.get("/resetPassword/:token", (req, res) => {
  const { token } = req.params;
  const recipient = cache.get(token);
  if (!recipient) {
    const errorMessage = "Invalid or expired password reset link.";
    res.render("resetPassword", { errorMessage });
    return;
  }
  res.render("resetPassword", { token });
});

// Handle the POST route for the reset password request form
router.post("/resetPassword", async (req, res) => {
  const { recipient } = req.body;
  const user = await userCollection.findOne({ email: recipient });
  if (!user) {
    const errorMessage =
      "The email address is not registered. Please try again or sign up to create an account.";
    res.render("resetPassword", { errorMessage, signupLink: "/signup" });
    return;
  }
  try {
    const currentUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    const uniqueString = uuidv4();
    cache.set(uniqueString, recipient, 60 * 60 * 1000); // cache for 1 hour
    await sendEmail(recipient, currentUrl, uniqueString);
    const emailSent =
      "An email with instructions to reset your password has been sent to your registered email address.";
    res.render("resetPassword", { emailSent });
  } catch (error) {
    const errorMessage = "Failed to send email. Please try again later.";
    res.render("resetPassword", { errorMessage });
  }
});

// Handle the POST route for the new password form
router.post("/resetPassword/:token", async (req, res) => {
  const { token } = req.params;
  const recipient = cache.get(token);
  if (!recipient) {
    const errorMessage = "Invalid or expired password reset link.";
    res.render("resetPassword", { errorMessage });
    return;
  }
  const { newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await userCollection.updateOne(
      { email: recipient },
      { $set: { password: hashedPassword } }
    );
    cache.del(token);
    res.redirect("/login");
  } catch (error) {
    const errorMessage = "Failed to reset password. Please try again later.";
    res.render("resetPassword", { errorMessage });
  }
});

// Helper function to send the password reset email
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
  const filePath = path.join(
    __dirname,
    "..",
    "views",
    "templates",
    "email.ejs"
  );
  const emailTemplate = fs.readFileSync(filePath, "utf-8");
  const renderedEmail = ejs.render(emailTemplate, {
    resetLink: `${currentUrl}/${uniqueString}`,
  });
  let info = await transporter.sendMail({
    from: `"Techommend" <${process.env.EMAIL_ADDRESS}>`,
    to: recipient,
    subject: "Password Reset Request",
    html: renderedEmail,
  });
}

// Export the router
module.exports = router;
