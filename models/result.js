const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const resultSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    examination_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "examination",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    time_end: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

resultSchema.plugin(toJSON);
resultSchema.plugin(paginate);

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
