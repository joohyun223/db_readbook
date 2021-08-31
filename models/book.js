const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isbn: { type: String, required: true },
    admn: { type: String, required: true },
    lender: { type: String, default: "연구소(보관)" },
  },
  {
    timestamps: true,
  }
);

bookSchema.statics.findAll = function () {
  return this.find({});
};

module.exports = mongoose.model("Book", bookSchema);
