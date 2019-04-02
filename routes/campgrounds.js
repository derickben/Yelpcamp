var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//var mongoose = require("mongoose");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//INDEX
router.get("/campgrounds", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});

        };
    })
    //res.render("index", {campgrounds: campgrounds});
});

//Create - add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    console.log(name);
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    };
    //campgrounds.push(newCampground);
    //Create a new Campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else{
            console.log(newlyCreated);
            req.flash("success", "Campground successfully added");
            res.redirect("/campgrounds");
        };
    });
});

//New - show form to add new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    //var id = req.params.id;
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if (err) {
            console.log(err);
        } else{
            console.log(foundCampground);
            res.render("campgrounds/show", {showCampground: foundCampground});
        };
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        req.flash("success", " Found Campground");
        res.render("campgrounds/edit", {showCampground: foundCampground, success: req.flash("success")});
    });    
});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.wrap, function(err, updatedCampground){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        };
    });
});

module.exports = router;