const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    isbn: { type: Number, required: true },
    gId: { type: String, required: true },
    lender: { type: String, default: false },
    email: {type: String, default: null},
    state: { type: String, default: "ING" },
    startTime: { type: String },
    returnTime: { type: String },
  },
  {
    timestamps: true,
  }
);

borrowSchema.statics.findAll = function () {
  return this.find({});
};

module.exports = mongoose.model("Borrow", borrowSchema);
