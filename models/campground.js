// initialize mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// setup campground schema
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

// export campground model
module.exports = mongoose.model('Campground', CampgroundSchema);