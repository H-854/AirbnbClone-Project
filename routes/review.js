const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");

const { isLoggedIn, authorizationReview } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

const validateReview = (req,res,next)=>{
    let result = reviewSchema.validate(req.body);
    if(result.error){
      throw new ExpressError(400,result.error);
    }else{
      next()
    }
  }
  

router.route("/")
.post(isLoggedIn,validateReview, wrapAsync(reviewController.addReview));

router.route("/:reviewId")
.delete(isLoggedIn,authorizationReview,wrapAsync(reviewController.destroyReview))

module.exports = router