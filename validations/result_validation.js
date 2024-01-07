const Joi = require("joi");

const createResult = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    examination_id: Joi.string().required(),
    score: Joi.number().required(),
  }),
};

const updateResult = {
  Headers: Joi.object().keys({
    resultId: Joi.string().required(),
  }),
};

const deleteResult = {
  params: Joi.object().keys({
    resultId: Joi.string().required(),
  }),
};

module.exports = {
  createResult,
  updateResult,
  deleteResult,
};
