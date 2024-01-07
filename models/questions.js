const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const questionSchema = mongoose.Schema(
  {
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // Change 'answer' field to an array of strings
    answer: [
      {
        type: String,
        required: true,
      },
    ],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    // Change 'correct_answer' to a string (the correct option)
    correct_answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.plugin(toJSON);
questionSchema.plugin(paginate);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
