const httpStatus = require("http-status");
const Question = require("../models/questions");
const Subject = require("../models/subject");
const ApiError = require("../utils/ApiError");

const queryQuestions = async (filter, options) => {
  const questions = await Question.paginate(filter, options);
  return questions;
};

const getQuestionById = async (id) => {
  return Question.findById(id);
};

const updateQuestionById = async (questionId, updateBody) => {
  const { subjectName, ...rest } = updateBody;

  // Check if a subject with the provided name exists
  const existingSubject = await Subject.findOne({ name: subjectName });

  if (!existingSubject) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Subject with the provided name does not exist"
    );
  }

  // Set the subject_id in the rest to the existing subject's ID
  rest.subject_id = existingSubject._id;

  // Update the question using the provided rest
  const question = await getQuestionById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Question not found");
  }

  Object.assign(question, rest);
  await question.save();
  return question;
};

const deleteQuestionById = async (questionId) => {
  const question = await getQuestionById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
  }
  await question.deleteOne();
  return question;
};

const createQuestion = async (userBody) => {
  const { subjectName, ...rest } = userBody;

  // Check if a subject with the provided name exists
  const existingSubject = await Subject.findOne({ name: subjectName });

  if (!existingSubject) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Subject with the provided name does not exist"
    );
  }

  // Set the subject_id in the userBody to the existing subject's ID
  rest.subject_id = existingSubject._id;

  // Create the question using the provided userBody
  try {
    const question = await Question.create(rest);
    return question;
  } catch (error) {
    console.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error creating the question"
    );
  }
};

module.exports = {
  createQuestion,
  queryQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
};
