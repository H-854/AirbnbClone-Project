const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

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


app.use(session(
  {
    secret: "mySecretCode",
    resave: false,
    saveUninitialized: true,
    cookie:{
      expires: Date.now() + 7*24*60*60*1000,
      maxAge: 7*24*60*60*1000,
      httpOnly: true
    }
  }
))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(port,()=>{
    console.log("Server is listening to port : ",3000);
})

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  next();
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