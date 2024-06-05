const express = require("express");
const { route } = require("./user");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.signupRender)
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.loginRender)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect: "/login",failureFlash: true}),userController.login)

router.route("/logout")
.get(userController.logout)

module.exports = router;