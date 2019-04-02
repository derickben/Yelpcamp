var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

//Comment - New
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    var id = req.params.id;
    Campground.findById(id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else{
            res.render("comments/new", {showCampground: foundCampground});
        };
    });
    
});

//Comment - Create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    //find campground using ID
    var id = req.params.id;
    Campground.findById(id, function(err, foundCampground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            //create new comment
            Comment.create(req.body.comment,function(err, comment){
                if (err) {
                    console.log(err);
                } else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username; //stores the name of the user commenting
                    comment.save();
                    console.log(req.user.username);
                    //connect new comment to campground
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    //redirect to campground show page 
                    req.flash("success", " Comment added successfully");
                    res.redirect("/campgrounds/" + id);
                }
            })
        };
    }); 
});

//edit comment
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            res.redirect("back");
        } else{
            res.render("comments/edit", {showCampground_id: req.params.id, comment: foundComment});
        };
    });    
});

//update comment
router.put("/campgrounds/:id/comments/:comment_id/", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back")
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        };
    });
});

//Destroy Comment
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        };
    });
});



module.exports = router;