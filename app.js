// setup express, mongoose, ejs-mate, joi, async wrapper, exrpesserror, method-override, and import models
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { redirect } = require('express/lib/response');
const { join } = require('path');

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

// render home page
app.get('/', (req, res) => {
    res.render('home');
});

// render camground index
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

// render campground create page
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// save campground data when posted then redirect
app.post('/campgrounds', catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    // use joi schema for validation
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    });
    // if validation error then pass to expresserror
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    console.log(result);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// render campground show page
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}));

// render campground edit form
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

// update with posted campground data
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}));

// delete campground from database
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

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