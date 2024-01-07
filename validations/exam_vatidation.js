const Joi = require("joi");

const createExamination = {
  body: Joi.object({
    subjectName: Joi.string().required(),
  }),
};

const deleteExamination = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

const getDetailsExam = {
  params: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

module.exports = {
  createExamination,
  deleteExamination,
  getDetailsExam,
};
