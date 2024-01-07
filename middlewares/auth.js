const jwt = require("jsonwebtoken");
const configs = require("../config/config");
const { roleRights } = require("../config/roles");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const verifyCallback = async (req, resolve, requiredRights) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      token = req.cookies?.authToken;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
      }
    }

    const tokenWithoutPrefix = token.slice(7);
    const decodedToken = await jwt.verify(
      tokenWithoutPrefix,
      configs.jwt.secret
    );
    req.user = decodedToken; // Set user information in the request

    if (requiredRights.length) {
      const userRights = roleRights.get(decodedToken.role);
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }
    }

    resolve();
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, error);
  }
};
const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    try {
      await verifyCallback(req, next, requiredRights);
      //next();
    } catch (error) {
      const result = { err: error.message, status: error.status || 401 };
      res.status(result.status).json(result);
    }
  };

module.exports = auth;
