const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const subjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

subjectSchema.plugin(toJSON);
subjectSchema.plugin(paginate);

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
