const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const resultService = require("../services/result");

const createResult = async (req, res) => {
  try {
    const result = await resultService.createResult(req.body);
    res.status(httpStatus.OK).json({ status: httpStatus.OK, data: result });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const getResults = async (req, res) => {
  try {
    // Use pick to get specific fields from the query if needed
    const filter = pick(req.query, [
      "user_id",
      "examination_id",
      "score",
      "time_end",
    ]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const results = await resultService.queryResults(filter, options);
    res.send(results);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const getResult = async (req, res) => {
  try {
    const result = await resultService.getResultById(req.params.resultId);
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Result not found");
    }
    res.send(result);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const getResultByStudentId = async (req, res) => {
  try {
    const studentId = req.params.studentId; // Assuming you're passing studentId in the URL parameters
    const results = await resultService.getResultByStudentId(studentId);
    res.send(results);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const updateResult = async (req, res) => {
  try {
    console.log(req.params.resultId);
    const result = await resultService.updateResultById(
      req.params.resultId,
      req.body
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const deleteResult = async (req, res) => {
  try {
    await resultService.deleteResultById(req.params.resultId);
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: `Delete Result With ID = ${req.params.resultId}`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

module.exports = {
  createResult,
  getResult,
  getResults,
  updateResult,
  deleteResult,
  getResultByStudentId,
};
