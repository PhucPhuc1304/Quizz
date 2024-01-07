const Joi = require("joi");

const createQuestion = {
  body: Joi.object().keys({
    subjectName: Joi.string().required(),
    content: Joi.string().required(),
    answer: Joi.array().items(Joi.string()).required(),
    difficulty: Joi.string().valid("easy", "medium", "hard").required(),
    correct_answer: Joi.string().required(),
  }),
};

const updateQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required(),
  }),
};

const deleteQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required(),
  }),
};

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
