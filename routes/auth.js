const express = require('express');
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth_validation');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.get('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;