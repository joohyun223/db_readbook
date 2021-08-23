const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema(
    {
        isbn: {type: Number, required: true},
        lender: {type: String, default: false}
    },
    {
        timestamps: true
    }
)

borrowSchema.statics.findAll = function(){
    return this.find({});
}

module.exports = mongoose.model('Borrow', borrowSchema);