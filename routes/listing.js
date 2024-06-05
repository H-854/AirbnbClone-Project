const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const { isLoggedIn, authorization } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
      throw new ExpressError(400,result.error);
    }else{
      next()
    }
}

router.route("/")
.get(wrapAsync(listingController.index))
.post(validateListing, wrapAsync(listingController.new))
  

router.route("/add/new")
.get(isLoggedIn,listingController.renderNew);

router.route("/:id")
.get(wrapAsync(listingController.show))
.delete(isLoggedIn,authorization,wrapAsync(listingController.destroy))
.put(isLoggedIn,authorization,upload.single("listing[image]"),validateListing,wrapAsync(listingController.update))


router.route("/:id/edit")
.get(isLoggedIn,authorization,wrapAsync(listingController.edit));

module.exports = router