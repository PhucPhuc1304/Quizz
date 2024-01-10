const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const examSevices = require("../services/exam");
const questionSevices = require("../services/questions");
const createExam = async (req, res) => {
  try {
    const exam = await examSevices.createExam(req.body.subjectName);
    res.status(httpStatus.OK).json({ status: httpStatus.OK, data: exam });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const getDetailsExam = async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve exam details
    const exam = await examSevices.getExamById(id);
    // Retrieve details for each question in the exam
    //const questionsDetails = await Promise.all(exam.questions.map(questionId => questionSevices.getQuestionById(questionId)));

    res.status(httpStatus.OK).json({ status: httpStatus.OK, data: { exam } });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete exam by ID
    await examSevices.deleteExamById(id);

    res
      .status(httpStatus.OK)
      .json({ status: httpStatus.OK, message: "Exam deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

module.exports = {
  createExam,
  getDetailsExam,
  deleteExam,
};
