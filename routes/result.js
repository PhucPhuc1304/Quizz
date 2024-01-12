const express = require("express");
const resultController = require("../controllers/resultController");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const resultValidation = require("../validations/result_validation");

const router = express.Router();

router.post(
  "/",
  auth("getResult"),
  validate(resultValidation.createResult),
  resultController.createResult
);
router.get("/", auth("getResult"), resultController.getResults);
router.get("/:resultId", auth("getResult"), resultController.getResult);
router.get(
  "/student/:studentId",
  auth("getResult"),
  resultController.getResultByStudentId
);

router.post(
  "/update/:resultId",
  auth("manageResult"),
  validate(resultValidation.updateResult),
  resultController.updateResult
);
router.post(
  "/delete/:resultId",
  auth("manageResult"),
  validate(resultValidation.deleteResult),
  resultController.deleteResult
);

module.exports = router;
