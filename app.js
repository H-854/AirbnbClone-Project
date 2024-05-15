const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path")
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
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data
const port = 3000;

app.listen(port,()=>{
    console.log("Server is listening to port : ",3000);
})

//Index route
app.get("/listings",async (req,res)=>{
  await Listing.find({}).then((listings)=>{
    res.render("listings/index.ejs",{ listings})
  })
  .catch((e)=>{
    res.send(e);
  })
})

//Show Route
app.get("/listings/:id",async (req,res)=>{
  let { id } = req.params;
  await Listing.findById(id).then((data)=>{
    res.render("listings/show.ejs",{ data });
  })
})