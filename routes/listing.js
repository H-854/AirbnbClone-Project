const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

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
    const data = await Listing.findById(id).populate("reviews");
    if(!data){
      req.flash("failure","Listing doesn't exit");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ data });
}))
  
  //Delete Route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then(()=>{
      req.flash("success","Listing deleted")
      res.redirect("/listings")
    })
}))
  
  //Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
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
router.put("/:id",validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated")
   
    res.redirect(`/listings/${id}`);
}));
  
  //new route
router.get("/add/new",(req,res)=>{
  if(!req.isAuthenticated()){
    req.flash("failure","You must be logged in");
    return res.redirect("/login")
  }
  res.render("listings/new.ejs");
})
  
  
router.post("/",validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}));

module.exports = router