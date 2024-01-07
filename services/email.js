const nodemailer = require("nodemailer");
const config = require("../config/config");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport.verify();
}

/**
 * Send an email
 * @param {string} to
 * @param {string} title
 * @param {string} content
 * @returns {Promise}
 */
const sendEmail = async (to, title, content) => {
  const msg = { from: config.email.from, to, subject: title, html: content };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.url}/v1/auth/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send account activation email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendEmailActivationEmail = async (to, token) => {
  const title = "Email Confirmation";
  const activationUrl = `${config.url}:${config.port}/api/v1/auth/verify-email?token=${token}`;
  const content =
    `<html>
      <body>
        <h1>Hi there,</h1>
        <p>Thank you for registering!</p>
        <p>Please click on the following link to activate your account:</p>
        <button><a href="${activationUrl}">Click here</a></button>
        <br />
        <p>Best regards,</p>
        <p>itDEV HUTECH QUIZZ</p>
      </body>
    </html>`;
  await sendEmail(to, title, content);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendEmailActivationEmail,
};
