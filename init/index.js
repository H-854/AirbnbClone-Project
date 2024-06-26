const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initdata = require("../init/data.js");

main()
.then(()=>{
    console.log("Connection established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnbClone');
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((el)=>({...el,owner:'66558e50152761a3d1d961a0'}))
    await Listing.insertMany(initdata.data);
    console.log("DATA SAVED");
}

initDb();