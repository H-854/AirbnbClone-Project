const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews)


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