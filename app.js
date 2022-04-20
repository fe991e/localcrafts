if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const mongoDbStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/local-crafts';

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressErrs = require('./utilits/ExpressErrs');

const craftsRts = require('./routes/craftsRoutes');
const craftRts = require('./routes/craftRoutes');
const reviewRts = require('./routes/reviewRoutes');
const userRts = require('./routes/userRoutes');

const passport = require('passport');
const localAuthStgy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

mongoose.connect(dbUrl);
//old monngodb settings //{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true }
//mongoose conn initialize
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database Connected");
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))

//Serving the public dir
app.use(express.static(path.join(__dirname, 'public')));
//to parse the req.body.crafts
app.use(express.urlencoded({extended: true}));
//override the POST method to use PUT
app.use(methodOverride('_method'));
//mongo Security from any req query Injections
app.use(mongoSanitize());

const secret = process.env.SECRET || 'secreeeeetSesssssss';

const store = mongoDbStore.create({
    mongoUrl: dbUrl,
    secret,
    collectionName: 'sessions',
    touchAfter: 24 * 60 * 60 //time in seconds
});
store.on("error", function (e) {
    console.log("Session Store ERROR", e)
});
//express-session before the passport.session
const sessConfig = {
    store,
    name: 'sessLogLc',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessConfig));

app.use(flash());

const scriptSrcUrls = [
    'https://stackpath.bootstrapcdn.com/',
    'https://api.tiles.mapbox.com/',
    'https://api.mapbox.com/',
    'ttps://kit-free.fontawesome.com/',
    'https://cdnjs.cloudflare.com/',
    'https://cdn.jsdelivr.net',
    'https://dshie3ran.cloudinary.com/'
];
const styleSrcUrls = [
    'https://kit-free.fontawesome.com/',
    'https://stackpath.bootstrapcdn.com/',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css',
    'https://api.mapbox.com/',
    'https://api.tiles.mapbox.com/',
    'https://fonts.googleapis.com/',
    'https://use.fontawesome.com/'
];
const connectSrcUrls = [
    'https://api.mapbox.com/',
    'https://a.tiles.mapbox.com/',
    'https://b.tiles.mapbox.com/',
    'https://events.mapbox.com/',
    'https://api.cloudinary.com/'
];
const imgSrcUrls = [
    'https://images.unsplash.com/',
    'https://source.unsplash.com/collection/10768444',
    'https://source.unsplash.com/collection/2580789',
    'https://res.cloudinary.com/dshie3ran/',
    'https://res.cloudinary.com/dshie3ran/image/upload/',

];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: [ "'self'", ...connectSrcUrls ],
            scriptSrc: [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc: [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc: [ "'self'", 'blob:' ],
            objectSrc: [],
            imgSrc: [
                "'self'",
                'blob:',
                'data:',
                ...imgSrcUrls                
            ],
            fontSrc: [ "'self'", ...fontSrcUrls ]
        }
    })
);

//Authn & Authr
//IMPORTANT!!!these must be first before the Routes
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localAuthStgy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//locals is available throughout the App
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
});
//router pre-routes
app.use('/', userRts);
app.use('/crafts', craftsRts);
app.use('/craft', craftRts);
app.use('/craft/:id/review', reviewRts);

//Home
app.get('/', (req, res) => {
    res.render('home')
})

//If No route match
app.all('*', (req, res, next)=>{
    next(new ExpressErrs('Page not Found', 404))
})

//All Error handler middleware   
app.use((err, req, res, next)=>{
    const {statCode = 500} = err;
    if (!err.message) err.message = 'Something went Wrong!';
    res.status(statCode).render('error', {err})
})


app.listen(3000, () => {
    console.log('Live on Port: 3000')
})