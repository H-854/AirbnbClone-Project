const express = require("express");
const { route } = require("./user");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let { username,email,password } = req.body;
        let newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","User registered");
        res.redirect("/listings");
    }
    catch(e){
        req.flash("failure",e.message)
        res.redirect("/signup")
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})
router.post("/login",passport.authenticate('local',{failureRedirect: "/login",failureFlash: true}),async (req,res)=>{
    req.flash("success","Welcome you are logged in");
    res.redirect("/listings");
})
module.exports = router;