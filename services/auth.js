const httpStatus = require('http-status');
const tokenService = require('../services/token');
const userService = require('../services/user');
const ApiError = require('../utils/ApiError');


const loginUserWithEmailAndPassword = async (email, password) => {
    try {
        const user = await userService.getUserByEmail(email);

        if (!user || !(await user.isPasswordMatch(password))) {
            return {
                statusCode: httpStatus.UNAUTHORIZED,
                message: 'Incorrect email or password',
            };
        } else if (!user.active) {
            return {
                statusCode: httpStatus.UNAUTHORIZED,
                message: 'Account is inactive. Please activate your account by clicking our verification link that has been sent to your email address.',
            };
        }

        return {
            statusCode: httpStatus.OK,
            message: 'Login successful',
            data: user,
        };
    } catch (error) {
       
        console.error('Error in login:', error);
        return {
            statusCode: error.statusCode,
            message: error.message,
        };
    }
};

const verifyEmail = async (emailVerificationToken) => {
    try {
        const emailVerificationTokenDoc = await tokenService.verifyToken(emailVerificationToken);
        const user = await userService.getUserById(emailVerificationTokenDoc.user);
        if(!user) {
            throw new Error();
        }
        await userService.updateUserById(user.id, { active: true });
    } catch(error){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Failed to verify your email');
    }
}

module.exports = {
    loginUserWithEmailAndPassword,
    verifyEmail,
};