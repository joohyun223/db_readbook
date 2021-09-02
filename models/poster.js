const mongoose = require("mongoose");

const posterSchema = new mongoose.Schema(
  {
    isbn: { type: String, required: true },
    imgUri: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

posterSchema.statics.findAll = function () {
  return this.find({});
};

module.exports = mongoose.model("Poster", posterSchema);
