var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose"),
    moment = require("moment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

    require('dotenv/config');

    //requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb+srv://derick:church@yelpcamp-r8fca.mongodb.net/yelp_camp?retryWrites=true", { useNewUrlParser: true })    
//mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

app.locals.moment = require('moment');

//passport config
app.use(require("express-session")({
    secret: "Happy birthday baby",
    resave: false,
    saveUninitialized: false
}));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//seedDB(); 

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes)

app.listen(process.env.PORT || 5000, function(){
    console.log("Server has started");
});