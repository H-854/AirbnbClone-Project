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
        type: String,
        default: "https://unsplash.com/photos/the-sun-is-setting-over-a-body-of-water-AhMoWv0fQzc",
        set: (v) =>
            v === ""
              ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
              : v,
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