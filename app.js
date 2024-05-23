const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");

app.use(methodOverride('_method'));

main()
.then(()=>{
    console.log("Connection established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnbClone');
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data
//serving static files
app.use(express.static(path.join(__dirname,"/public")));


// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
const port = 3000;

app.listen(port,()=>{
    console.log("Server is listening to port : ",3000);
})



const validateReview = (req,res,next)=>{
  let result = reviewSchema.validate(req.body);
  if(result.error){
    // let errDetail = result.error.map((el)=>el.message).join(",");
    throw new ExpressError(400,result.error);
  }else{
    next()
  }
}

app.use("/listings", listings);

//adding a review
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req,res)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();
  res.redirect(`/listings/${id}`)
}))

//deleting review
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res)=>{
  let { id,reviewId } = req.params;
  await Listing.findByIdAndUpdate(id,{$pull: {review: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}))
//if req do not match 
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
})

//ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next)=>{
  let { status=500,message ="UNKNOWN ERROR OCCURED"} = err;
  res.status(status).render("error.ejs",{ err });
  // res.status(status).send(message);
})