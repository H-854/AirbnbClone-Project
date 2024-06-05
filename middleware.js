const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure","You must be logged in");
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.authorization = async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.userReq._id)){
      req.flash('failure',"Access denied");
      return res.redirect(`/listings/${id}`);
    }
    next()
}
module.exports.authorizationReview = async (req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.userReq._id)){
        req.flash('failure',"Access denied");
        return res.redirect(`/listings/${id}`);
      }
    next()
}