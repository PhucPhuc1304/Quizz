const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const subjectService = require("../services/subject");

const createSubject = async (req, res) => {
  try {
    const subject = await subjectService.createSubject(req.body);
    res.status(httpStatus.OK).json({ status: httpStatus.OK, data: subject });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode)
      .json({ status: error.statusCode, message: error.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    const filter = pick(req.query, ["name", "code"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await subjectService.querySubjects(filter, options);
    res.send(result);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const getSubject = async (req, res) => {
  try {
    const subject = await subjectService.getSubjectById(req.params.subjectId);
    if (!subject) {
      throw new ApiError(httpStatus.NOT_FOUND, "Subject not found");
    }
    res.send(subject);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const subject = await subjectService.updateSubjectById(
      req.params.subjectId,
      req.body
    );
    res.send(subject);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    await subjectService.deleteSubjectById(req.params.subjectId);
    res
      .status(httpStatus.OK)
      .json({
        status: httpStatus.OK,
        message: `Delete Subject With ID = ${req.params.subjectId}`,
      });
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ status: error.statusCode, message: error.message });
  }
};
module.exports = {
  createSubject,
  getSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
};
