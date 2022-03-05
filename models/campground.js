// initialize mongoose
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// setup campground schema
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// middleware to delete reviews from DB when campground deleted
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// export campground model
module.exports = mongoose.model('Campground', CampgroundSchema);