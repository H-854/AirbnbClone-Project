const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    await Listing.find({}).then((listings)=>{
      res.render("listings/index.ejs",{ listings})
    })
    .catch((e)=>{
      res.send(e);
    })
}

module.exports.show = async (req,res)=>{
    let { id } = req.params;
    const data = await Listing.findById(id).populate({path: "reviews",populate:{ path: "author"}}).populate("owner");
    if(!data){
      req.flash("failure","Listing doesn't exit");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ data });
}

module.exports.destroy = async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id).then(()=>{
      req.flash("success","Listing deleted")
      res.redirect("/listings")
    })
}

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing){
      req.flash("failure","Listing doesn't exit");
      res.redirect("/listings");
    }
    req.flash("success","Listing edited")
    res.render("listings/edit.ejs", { listing });
}

module.exports.update = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated")
    res.redirect(`/listings/${id}`);
}

module.exports.renderNew = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.new = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}