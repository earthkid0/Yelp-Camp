if (process.env.NODE_ENV !== "pruduction") {
    require('dotenv').config();
}

const express = require('express');

const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const mongoose = require('mongoose');

const campgroundRoute = require('./route/campground');
const reviewRoute = require('./route/review');
const userRoute = require('./route/user');




main().catch(err => console.log('DO NOT CONNECT!!', err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log('MONGO CONNECT!')
}

const app = express();

app.set('views', path.join(__dirname, ('views')));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate)
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'thissecret',
    resave: false,
    saveUninitialized: true,
    expire: Date.now() * 1000 * 60 * 60 * 60 * 7,
    maxAge: 1000 * 60 * 60 * 60 * 7,
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoute);
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/reviews', reviewRoute);


app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('404 Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'SOMTHING WRONG' } = err;
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('LISTEN 3000 PORT!!')
})