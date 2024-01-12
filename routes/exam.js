const express = require("express");
const examController = require("../controllers/examController");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const examValidation = require("../validations/exam_vatidation");

const router = express.Router();

router.post(
  "/",
  auth("getExams"),
  validate(examValidation.createExamination),
  examController.createExam
);
router.post(
  "/details/:id",
  validate(examValidation.getDetailsExam),
  auth("getExams"),
  examController.getDetailsExam
);
router.delete(
  "/delete/:id",
  validate(examValidation.deleteExamination),
  auth("manageExam"),
  examController.deleteExam
);

module.exports = router;
