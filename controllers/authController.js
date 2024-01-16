const httpStatus = require("http-status");
const userService = require("../services/user");
const tokenService = require("../services/token");
const emailService = require("../services/email");
const authService = require("../services/auth");
const user = require("../models/user");

const register = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);

    if (result.statusCode === httpStatus.CREATED) {
      const emailActivationToken =
        await tokenService.generateEmailActivationToken(req.body.email);
      await emailService.sendEmailActivationEmail(
        req.body.email,
        emailActivationToken
      );
      res
        .status(httpStatus.CREATED)
        .send({ status: result.statusCode, message: result.message });
    } else {
      // Handle other status codes if needed
      res
        .status(result.statusCode)
        .send({ status: result.statusCode, message: result.message });
    }
  } catch (error) {
    res
      .status(error.status)
      .send({ status: error.status, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUserWithEmailAndPassword(
      email,
      password
    );

    if (result.statusCode === httpStatus.OK) {
      const tokens = await tokenService.generateAuthTokens(result.data);
      res.cookie("authToken", tokens.access.token, { httpOnly: true });
      res.status(httpStatus.OK).send({
        status: result.statusCode,
        message: result.message,
        data: result.data,
        token: tokens,
      });
    } else {
      res
        .status(result.statusCode)
        .send({ status: result.statusCode, message: result.message });
    }
  } catch (error) {
    res
      .status(error.status)
      .send({ status: error.status, message: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("authToken");
  res.status("200").send({ message: "Logout successful" });
};

const verifyEmail = async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send({
    message: "Account verified. Please try to login using this email",
  });
};
const forgotPassword = async (req, res) => {
  try {
    const { status, message, token } =
      await tokenService.generateResetPasswordToken(req.body.email);

    if (status === httpStatus.NOT_FOUND) {
      return res.status(httpStatus.NOT_FOUND).send(message);
    }
    await emailService.sendResetPasswordEmail(req.body.email, token);
    res.status(status).send(message);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send("Internal Server Error"); // Handle errors appropriately
  }
};

const resetPassword = async (req, res) => {
  try {
    const { status, message } = await authService.resetPassword(
      req.query.token,
      "123456789"
    );

    if (status === httpStatus.OK) {
      res.status(httpStatus.NO_CONTENT).send("Password reset successfully");
    } else {
      res.status(status).send(message);
    }
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send("Invalid or expired token");
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
