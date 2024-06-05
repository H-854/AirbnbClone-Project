const mongoose = require('mongoose');
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

listingSchema.post("findByIdAndDelete",async (listing)=>{
    if(listing.reviews.length){
      await Review.deleteMany({reviews :{$in: listing.reviews}});
    }
})

const Listing = new mongoose.model("listing",listingSchema);

module.exports = Listing;