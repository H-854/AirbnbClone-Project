const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, authorizationReview } = require("../middleware.js");

const validateReview = (req,res,next)=>{
    let result = reviewSchema.validate(req.body);
    if(result.error){
      // let errDetail = result.error.map((el)=>el.message).join(",");
      throw new ExpressError(400,result.error);
    }else{
      next()
    }
  }
  
//adding a review
router.post("/",isLoggedIn,validateReview, wrapAsync(async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success","Review added successfully")
    res.redirect(`/listings/${id}`)
  }))
  
  //deleting review
  router.delete("/:reviewId",isLoggedIn,authorizationReview,wrapAsync(async (req,res)=>{
    let { id,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted")
    res.redirect(`/listings/${id}`);
  }))

module.exports = router