const express = require("express");
const questionController = require("../controllers/questionsController");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const questionValidation = require("../validations/question_validation");

const router = express.Router();

router.post(
  "/",
  auth("manageQuestions"),
  validate(questionValidation.createQuestion),
  questionController.createQuestion
);
router.get(
  "/",
  auth("getQuestions"),
  validate(questionValidation.getQuestions),
  questionController.getQuestions
);
router.get(
  "/:questionId",
  auth("getQuestion"),
  validate(questionValidation.getQuestion),
  questionController.getQuestion
);
router.post(
  "/update/:questionId",
  auth("manageQuestions"),
  validate(questionValidation.updateQuestion),
  questionController.updateQuestion
);
router.post(
  "/delete/:questionId",
  auth("manageQuestions"),
  validate(questionValidation.deleteQuestion),
  questionController.deleteQuestion
);

module.exports = router;
