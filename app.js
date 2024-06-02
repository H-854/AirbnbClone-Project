if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const userRouter = require("./routes/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
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
  await mongoose.connect(process.env.ATLAS_DB_URL);
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
const store = MongoStore.create({ mongoUrl: process.env.ATLAS_DB_URL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24*60*60
 })

app.use(session(
  {
    store: store,
    secret: process.env.SECRET,
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
  res.locals.userReq = req.user;
  next();
})

// app.get("/demo",async (req,res)=>{
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "stu123"
//   })
//   let registeredUser = await User.register(fakeUser,"password");  
//   res.send(registeredUser);
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

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
