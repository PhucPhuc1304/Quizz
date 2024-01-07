const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const examinationSchema = mongoose.Schema(
  {
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Populate the 'questions' field with the full content of the questions.
examinationSchema.pre("findOne", function (next) {
  this.populate("questions");
  next();
});

examinationSchema.plugin(toJSON);

const Examination = mongoose.model("Examination", examinationSchema);

module.exports = Examination;
