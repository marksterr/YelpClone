// setup express, mongoose, method-override, and import models
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { redirect } = require('express/lib/response');

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

// set express to parse request body
app.use(express.urlencoded({ extended: true }));
// configure express to handle all method requests
app.use(methodOverride('_method'));

// render home page
app.get('/', (req, res) => {
    res.render('home');
});
// render camground index
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});
// render campground create page
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// save campground data when posted then redirect
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

// render campground show page
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

// render campground edit form
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});

// update with posted campground data
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

// use localhost port 3000
app.listen(3000, () => {
    console.log('Serving on port 3000');
});