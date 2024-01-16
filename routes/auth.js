const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth_validation");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", authController.logout);
router.get(
  "/verify-email",
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.get(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);

module.exports = router;
