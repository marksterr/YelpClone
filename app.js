// setup express, mongoose, ejs-mate, schemas, async wrapper, exrpesserror, method-override, and import models
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


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

// set express engine to ejs-mate and connect to views folder
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// set express to parse request body
app.use(express.urlencoded({ extended: true }));

// configure express to handle all method requests
app.use(methodOverride('_method'));

//configure express to serve public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// render home page
app.get('/', (req, res) => {
    res.render('home');
});

// send error for request to nonexistant page
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// basic error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

// use localhost port 3000
app.listen(3000, () => {
    console.log('Serving on port 3000');
});