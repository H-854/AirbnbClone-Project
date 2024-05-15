const mongoose = require('mongoose');

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
        set: function(v) {
            if (typeof v === 'object' && v !== null && v.url) {
                return v.url;
            }
            return v === "" ? "https://unsplash.com/photos/the-sun-is-setting-over-a-body-of-water-AhMoWv0fQzc" : v;
        }
    },
    price: Number,
    location: String,
    country: String
})
const Listing = new mongoose.model("listing",listingSchema);

module.exports = Listing;