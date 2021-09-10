const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    isbn: { type: String, required: false },
    admn: { type: String, required: false },
    lender: { type: String, default: "연구소(보관)" },
    poster: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

bookSchema.statics.findAll = function () {
  return this.find({});
};

module.exports = mongoose.model("Book", bookSchema);
