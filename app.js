if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const User = require('./models/user');
const helmet = require("helmet");
const csp = require("helmet-csp");
const MongoDBstore = require('connect-mongo');

const campgroundRoute = require('./route/campground');
const reviewRoute = require('./route/review');
const userRoute = require('./route/user');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const port = process.env.PORT || 3000
const secret = process.env.SECRET || 'thisissecret'

async function main() {
    await mongoose.connect(dbUrl);
    console.log('MONGO CONNECT!')
}
main().catch(err => console.log('DO NOT CONNECT!!', err));

const app = express();

app.set('views', path.join(__dirname, ('views')));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash());
app.use(mongoSanitize({
    replaceWith: '_'
}));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    'https://api.mapbox.com/',
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];

app.use(helmet())
app.use(
    csp({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dn8qwg595/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
//helmet 사용시 cross-origin 에러 해결
app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "credentialless");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});

const store = MongoDBstore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    // secure:true,
    saveUninitialized: true,
    expire: Date.now() * 1000 * 60 * 60 * 60 * 7,
    maxAge: 1000 * 60 * 60 * 60 * 7,
}

app.use(session(sessionConfig))

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

app.listen(port, () => {
    console.log(`LISTEN ${port} PORT!!`)
})