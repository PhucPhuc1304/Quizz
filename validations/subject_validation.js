const Joi = require("joi");
const { password } = require("./custom_validation");

const createSubject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(), // Update to include the 'description' field
  }),
};

const updateSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),
};

const deleteSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),
};

module.exports = {
  createSubject,
  updateSubject,
  deleteSubject,
};
