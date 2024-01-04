const httpStatus = require('http-status');
const userService = require('../services/user')
const tokenService = require('../services/token')
const emailService = require('../services/email')
const authService = require('../services/auth');
const user = require('../models/user');

const register = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);

        if (result.statusCode === httpStatus.CREATED) {
            const emailActivationToken = await tokenService.generateEmailActivationToken(req.body.email);
            await emailService.sendEmailActivationEmail(req.body.email, emailActivationToken);
            res.status(httpStatus.CREATED).send({  status: result.statusCode, message: result.message});
        } else {
            // Handle other status codes if needed
            res.status(result.statusCode).send({ status: result.statusCode, message: result.message });
        }
    } catch (error) {
        res.status(error.status).send({ status: error.status, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUserWithEmailAndPassword(email, password);

        if (result.statusCode === httpStatus.OK) {
            const tokens = await tokenService.generateAuthTokens(result.data);
            res.cookie('authToken', tokens.access.token, { httpOnly: true });
            res.status(httpStatus.OK).send({ status: result.statusCode, message: result.message, data: result.data ,token : tokens });
        } else {
            res.status(result.statusCode).send({ status: result.statusCode, message: result.message });
        }
    } catch (error) {
        res.status(error.status).send({ status: error.status, message: error.message });
    }
};


const verifyEmail = async (req, res) => {
    await authService.verifyEmail(req.query.token);
    res.status(httpStatus.NO_CONTENT).send({ message: 'Account verified. Please try to login using this email'});
};



module.exports = {
    register,
    login,
    verifyEmail,
};