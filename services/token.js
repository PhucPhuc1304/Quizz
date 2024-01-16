const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const moment = require("moment");
const config = require("../config/config");
const userService = require("./user");

const generateToken = (
  userId,
  userRole,
  expires,
  secret = config.jwt.secret
) => {
  const payload = {
    sub: userId,
    role: userRole,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const verifyToken = async (token) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = {
    token,
    user: payload.sub,
  };
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  console.log(accessTokenExpires);

  const accessToken = generateToken(user.id, user.role, accessTokenExpires);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    return {
      status: httpStatus.NOT_FOUND,
      message: "No user found with this email",
      token: null,
    };
  }

  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  console.log(user.id, user.role, expires);
  const resetPasswordToken = generateToken(user.id, user.role, expires);

  return {
    status: httpStatus.OK,
    message: "Token generated successfully",
    token: resetPasswordToken,
  };
};

const generateEmailActivationToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error("No user found with this email");
  }
  const expires = moment().add(
    config.jwt.emailActivationExpirationMinutes,
    "minutes"
  );
  const emailActivationToken = generateToken(user.id, user.role, expires);
  return emailActivationToken;
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateEmailActivationToken,
};
