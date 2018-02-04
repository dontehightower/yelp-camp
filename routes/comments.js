var express = require('express');
var router  = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment    = require('../models/comment');
var middleware = require('../middleware');

//Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find a comment by Id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    campground.comments.push(comment);
                    // connect the comment to campground
                    campground.save();
                    req.flash("success", "Successfully created comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    // redirect to show page
});

//EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
               res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); 
        }
    });
});

//UPDATE COMMENTS
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE COMMENTS
router.delete("/:comment_id", function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;