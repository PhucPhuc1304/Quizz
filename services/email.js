const nodemailer = require('nodemailer');
const config = require('../config/config');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify();
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
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
  const subject = 'Email Confirmation';
  const activationUrl = `${config.url}/v1/auth/verify-email?token=${token}`;
  const text = `Dear user, 
  Please click thi link to activate your account: ${activationUrl}
  If you did not request for any email activation, then ignore this email.`;  
  await sendEmail(to, subject, text);
}

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendEmailActivationEmail,
};