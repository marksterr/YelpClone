// setup express, mongoose, and import models
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

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

const app = express(); // initialize express server

// connect express to views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// render home page
app.get('/', (req, res) => {
    res.render('home');
});
// render make a campground
app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My Backyard', description: 'cheap camping!' });
    await camp.save();
    res.send(camp);
});

// use localhost port 3000
app.listen(3000, () => {
    console.log('Serving on port 3000');
});