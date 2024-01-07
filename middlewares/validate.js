const Joi = require("joi");
const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    const apiError = new ApiError(httpStatus.BAD_REQUEST, errorMessage);

    return res.status(apiError.statusCode).json({
      status: apiError.statusCode,
      message: apiError.message,
    });
  }

  Object.assign(req, value);
  return next();
};

module.exports = validate;
