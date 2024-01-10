const Exam = require("../models/examination"); // Adjust the path as needed
const Question = require("../models/questions"); // Adjust the path as needed
const Subject = require("../models/subject");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const createExam = async (subjectName) => {
  const questions = await generateQuestions(subjectName);

  const exam = await Exam.create({
    start_time: new Date(),
    end_time: new Date(), // You need to set the appropriate end time
    questions: questions.map((question) => question._id),
  });

  return exam;
};

// Helper function to generate questions based on subjectName and difficulty levels
const generateQuestions = async (subjectName) => {
  try {
    const existingSubject = await Subject.findOne({ name: subjectName });
    if (!existingSubject) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Subject with the provided name does not exist"
      );
    }

    const subject_id = existingSubject._id;
    const easyQuestions = await Question.aggregate([
      { $match: { subject_id: subject_id, difficulty: "easy" } },
      { $sample: { size: 3 } },
    ]);

    const mediumQuestions = await Question.aggregate([
      { $match: { subject_id: subject_id, difficulty: "medium" } },
      { $sample: { size: 3 } },
    ]);

    const hardQuestions = await Question.aggregate([
      { $match: { subject_id: subject_id, difficulty: "hard" } },
      { $sample: { size: 3 } },
    ]);

    // Additional logic for getting 1 random question
    const randomQuestion = await Question.aggregate([
      { $match: { subject_id: subject_id } },
      { $sample: { size: 1 } },
    ]);

    // Combine and shuffle the questions
    const allQuestions = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions,
      ...randomQuestion,
    ];
    const shuffledQuestions = allQuestions;

    return shuffledQuestions;
  } catch (error) {
    console.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error generating random questions for exam"
    );
  }
};

const getExamById = async (examId) => {
  try {
    const exam = await Exam.findById(examId); // Assuming 'questions' is the field in your Examination model that holds the question IDs
    if (!exam) {
      throw new ApiError(httpStatus.NOT_FOUND, "Exam not found");
    }

    return exam.toObject(); // Convert Mongoose document to plain JavaScript object
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteExamById = async (examId) => {
  try {
    const result = await Exam.findByIdAndDelete(examId);

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Exam not found");
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};
module.exports = {
  createExam,
  getExamById,
  deleteExamById,
};
