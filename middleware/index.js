var Campground = require('../models/campground');
var Comment = require('../models/comment');

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
     // is user logged in
    if(req.isAuthenticated()) { 
        // does user own the campground?
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("/campgrounds");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    // if not logged in, redirect
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
     // is user logged in
    if(req.isAuthenticated()) { 
        // does user own the comment?
        Comment.findById(req.params.id, function(err, foundComment){
            if(err){
                res.redirect("/campgrounds");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.")
                    res.redirect("back");
                }
            }
        });
    // if not logged in, redirect
    } else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;