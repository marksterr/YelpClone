// setup mongoose schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define review model
const reviewSchema = new Schema({
    body: String,
    rating: Number
});

// export review model
module.exports = mongoose.model('Review', reviewSchema);