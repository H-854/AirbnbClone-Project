const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, authorization } = require("../middleware.js");
const validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
    //   let errDetail = result.error.map((el)=>el.message).join(",");
      throw new ExpressError(400,result.error);
    }else{
      next()
    }
}
//Index route
router.get("/",wrapAsync(async (req,res)=>{
    await Listing.find({}).then((listings)=>{
      res.render("listings/index.ejs",{ listings})
    })
    .catch((e)=>{
      res.send(e);
    })
}))
  
  //Show Route
router.get("/:id",wrapAsync(async (req,res)=>{
    let { id } = req.params;
    const data = await Listing.findById(id).populate({path: "reviews",populate:{ path: "author"}}).populate("owner");
    if(!data){
      req.flash("failure","Listing doesn't exit");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ data });
}))
  
  //Delete Route
router.delete("/:id",isLoggedIn,authorization,wrapAsync(async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then(()=>{
      req.flash("success","Listing deleted")
      res.redirect("/listings")
    })
}))
  
  //Edit Route
router.get("/:id/edit",isLoggedIn,authorization,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing){
      req.flash("failure","Listing doesn't exit");
      res.redirect("/listings");
    }
    req.flash("success","Listing edited")
    res.render("listings/edit.ejs", { listing });
}));
  
  //Update Route
router.put("/:id",isLoggedIn,authorization,validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated")
    res.redirect(`/listings/${id}`);
}));
  
  //new route
router.get("/add/new",isLoggedIn,(req,res)=>{
  res.render("listings/new.ejs");
})
  
  
router.post("/",validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));

module.exports = router