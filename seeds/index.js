// setup mongoose, import models and seed data
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

// connect mongoose to mongo database
mongoose.connect('mongodb://localhost:27017/yelp-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// verify mongoose connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// sample random element from array
const sample = array => array[Math.floor(Math.random() * array.length)];

// clear campground database and seed with 50 random campgrounds
const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero voluptatibus necessitatibus, ea autem sapiente voluptas eveniet iusto exercitationem corrupti. Magnam facilis reiciendis repellendus aperiam eveniet molestiae earum incidunt optio nemo!',
            price
        });
        await camp.save();
    }
}

// call seed func and close mongoose connection
seedDB().then(() => {
    mongoose.connection.close();
});