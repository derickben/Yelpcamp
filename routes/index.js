var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");

router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email, 
        avatar: req.body.avatar
    });
    if(req.body.adminCode === "secretcodee123") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            req.flash("error", err);
            return res.render("register", {error: req.flash("error")});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//User Login
router.get("/login", function(req, res){
    res.render("login", {page: "login"});
});
//login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){

});

//User Logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "User Logged out");
    res.redirect("/campgrounds");
});

//User Profile
router.get("/users/:id", (req,res) => {
    User.findById(req.params.id)
    .then(foundUser => {
        if (!foundUser) {
            req.flash("error", err);
            res.redirect("/campgrounds");
        }
        Campground.find().where('author.id').equals(foundUser._id).exec((err, campgrounds) => {
            if (err) {
                req.flash("error", err);
                res.redirect('/campgrounds');
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds})
        })
        
    })
    .catch(err => {
        if (err) {
            req.flash("error", err);
            res.redirect('/campgrounds');
        }
    })  
});


module.exports = router;