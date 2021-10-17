const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    data: { type: Object, require: true}
    // name: { type: String, required: true },
    // gId: { type: String, required: false },
    // picture: {type: String, required: false},
    // email: {type: String , default: ''},
    // rendCnt: {type: Number, required: true},
    // year: {type: Number, required: true},
    // month: {type: Number, required: true},
  },
  {
    timestamps: true,
  }
);

personSchema.statics.findAll = function () {
  return this.find({});
};

module.exports = mongoose.model("Person", personSchema);
