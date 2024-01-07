const express = require("express");
const subjectController = require("../controllers/subjectController");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const subjectValidation = require("../validations/subject_validation");

const router = express.Router();

router.post(
  "/",
  auth("manageSubjects"),
  validate(subjectValidation.createSubject),
  subjectController.createSubject
);
router.get(
  "/",
  auth("getSubjects"),
  validate(subjectValidation.getSubjects),
  subjectController.getSubjects
);
router.get(
  "/:subjectId",
  auth("getSubject"),
  validate(subjectValidation.getSubject),
  subjectController.getSubject
);
router.post(
  "/update/:subjectId",
  auth("manageSubjects"),
  validate(subjectValidation.updateSubject),
  subjectController.updateSubject
);
router.post(
  "/delete/:subjectId",
  auth("manageSubjects"),
  validate(subjectValidation.deleteSubject),
  subjectController.deleteSubject
);

module.exports = router;
