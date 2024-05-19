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

const validateListing = (req,res,next)=>{
  let result = listingSchema.validate(req.body);
  if(result.error){
    let errDetail = result.error.map((el)=>el.message).join(",");
    throw new ExpressError(400,errDetail);
  }else{
    next()
  }
}
//Index route
app.get("/listings",wrapAsync(async (req,res)=>{
  await Listing.find({}).then((listings)=>{
    res.render("listings/index.ejs",{ listings})
  })
  .catch((e)=>{
    res.send(e);
  })
}))

//Show Route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
  let { id } = req.params;
  await Listing.findById(id).then((data)=>{
    res.render("listings/show.ejs",{ data });
  })
}))

//Delete Route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
  let { id } = req.params;
  await Listing.findByIdAndDelete(id).then(()=>{
    res.redirect("/listings")
  })
}))

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id",validateListing,wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//new route
app.get("/listings/add/new",(req,res)=>{
  res.render("listings/new.ejs");
})


app.post("/listings",validateListing, wrapAsync(async (req, res) => {
  
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

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