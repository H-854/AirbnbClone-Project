const express = require("express");
const app = express();
const mongoose = require('mongoose');

main()
.then(()=>{
    console.log("Connection established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnbClone');
}

const port = 3000;

app.listen(port,()=>{
    console.log("Server is listening to port : ",3000);
})