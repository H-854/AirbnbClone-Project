const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.addReview = async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success","Review added successfully")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyReview = async (req,res)=>{
    let { id,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted")
    res.redirect(`/listings/${id}`);
  }