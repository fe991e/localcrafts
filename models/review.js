const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./user');

const reviewSchema = new Schema({
    text: String,
    rating: {
        type: Number,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: User
    }
})

module.exports = mongoose.model("Review", reviewSchema)
