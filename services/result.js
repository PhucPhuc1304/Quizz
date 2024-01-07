const httpStatus = require("http-status");
const Result = require("../models/result");
const User = require("../models/user");
const Examination = require("../models/examination");
const ApiError = require("../utils/ApiError");

const queryResults = async (filter, options) => {
  const results = await Result.paginate(filter, options);
  return results;
};

const getResultById = async (id) => {
  return Result.findById(id);
};

const updateResultById = async (resultId, updateBody) => {
  const { score, time_end } = updateBody;

  // Update the result using the provided properties
  const result = await getResultById(resultId);
  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Result not found");
  }

  // Set time_end to the current date if not provided
  result.time_end = time_end ? new Date(time_end) : new Date();

  // Update the result properties
  result.score = score;

  await result.save();

  return result;
};

const deleteResultById = async (resultId) => {
  const result = await getResultById(resultId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Result not found");
  }
  await result.deleteOne();
  return result;
};

const createResult = async (userBody) => {
  const { user_id, examination_id, ...rest } = userBody;

  // Check if the result for the given user_id and examination_id already exists
  const existingResult = await Result.findOne({ user_id, examination_id });
  if (existingResult) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Result already exists for this user and examination"
    );
  }

  // Check if the user with the provided ID exists
  const existingUser = await User.findById(user_id);
  if (!existingUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User with the provided ID does not exist"
    );
  }

  // Check if the examination with the provided ID exists
  const existingExamination = await Examination.findById(examination_id);
  if (!existingExamination) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Examination with the provided ID does not exist"
    );
  }

  // Set the user_id and examination_id in the rest to the existing user's and examination's IDs
  rest.user_id = existingUser._id;
  rest.examination_id = existingExamination._id;

  // Create the result using the provided userBody
  try {
    const result = await Result.create(rest);
    return result;
  } catch (error) {
    console.error(error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error creating the result"
    );
  }
};

const getResultByStudentId = async (studentId) => {
  try {
    const results = await Result.find({ user_id: studentId });
    return results || []; // Return an empty array if no results are found
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error retrieving results"
    );
  }
};

module.exports = {
  createResult,
  queryResults,
  getResultById,
  updateResultById,
  deleteResultById,
  getResultByStudentId,
};
