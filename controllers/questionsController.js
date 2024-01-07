const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const questionService = require("../services/questions");

const createQuestion = async (req, res) => {
  try {
    const question = await questionService.createQuestion(req.body);
    res.status(httpStatus.OK).json({ status: httpStatus.OK, data: question });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const filter = pick(req.query, [
      "subjectName",
      "content",
      "answer",
      "difficulty",
    ]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await questionService.queryQuestions(filter, options);
    res.send(result);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const getQuestion = async (req, res) => {
  try {
    const question = await questionService.getQuestionById(
      req.params.questionId
    );
    if (!question) {
      throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
    }
    res.send(question);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await questionService.updateQuestionById(
      req.params.questionId,
      req.body
    );
    res.send(question);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    await questionService.deleteQuestionById(req.params.questionId);
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: `Delete Question With ID = ${req.params.questionId}`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

module.exports = {
  createQuestion,
  getQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
};
