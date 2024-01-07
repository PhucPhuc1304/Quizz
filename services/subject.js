const httpStatus = require("http-status");
const Subject = require("../models/subject");
const ApiError = require("../utils/ApiError");

const querySubjects = async (filter, options) => {
  const subjects = await Subject.paginate(filter, options);
  return subjects;
};

const getSubjectById = async (id) => {
  return Subject.findById(id);
};

const getSubjectByName = async (name) => {
  return Subject.findOne({ name });
};

const updateSubjectById = async (subjectId, updateBody) => {
  const subject = await getSubjectById(subjectId);
  if (!subject) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Subject not found");
  }
  Object.assign(subject, updateBody);
  await subject.save();
  return subject;
};

const deleteSubjectById = async (subjectId) => {
  const subject = await getSubjectById(subjectId);
  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, "Subject not found");
  }
  await subject.deleteOne();
  return subject;
};
const createSubject = async (userBody) => {
  const { name } = userBody;

  // Check if a subject with the same name already exists
  const existingSubject = await getSubjectByName(name);

  if (existingSubject) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Subject with the same name already exists"
    );
  }

  // Create the subject if it doesn't exist
  try {
    const subject = await Subject.create(userBody);
    return subject;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error for proper handling in the controller
  }
};
module.exports = {
  createSubject,
  querySubjects,
  getSubjectById,
  getSubjectByName,
  updateSubjectById,
  deleteSubjectById,
};
