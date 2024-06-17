// MVC : Model, View, Controller

const Listing = require("../models/listing")

// MAP : MAPBOX
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req, res)=>{
    const allListings = await Listing.find({});   // find all the listings
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
}


module.exports.createListing = async (req, res, next)=>{

    // if(!req.body.listing){
    // throw new expressError(400, "send valid data for listing");
    // }   // incase if the client don't send any data in 'req.body.listing' and try to access post request on "http://localhost:8080/listings/" , then this error will be thrown

    // we've used "joi" to validate the schema for error handling. It's an npm package for schema validation. Installed "joi npm" --> created a file "Schema.js", defined a schema using "joi" validation --> required it --> now using it for validation
    /* let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new expressError(400, result.error);   // if there's error in result then an expressError will be thrown
    } */
    // now we'll make a function of the above schema validation code, and then use that function as middleware

    // for Map geocoding (to get the coordinates to show in the map) => https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
          })
        .send()
        // console.log(response.body.features[0].geometry.coordinates);
    
    // to save the uploaded image's path and filename (that'll be fetched from cloud i.e. cloudinary)
          let url = req.file.path;
          let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;  // to fetch the "owner.username" & save it to database.
    newListing.geometry = response.body.features[0].geometry;    // saved the coordinates in Database
    newListing.image = {url, filename};  // to save the image.path and image.filename in database
    
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}


module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({             // used "populate" method so that we can see the "reviews" data and "reviews author" data on the display 
            path : "reviews",
            populate : {
                path : "author"
            }
        })
        .populate("owner");  // used "populate" method so that we can see the "owner" data on the display 

    if(!listing){
        req.flash("error", "Listing you are requested for doesn't exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}


module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you are requested for doesn't exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}


module.exports.updateListing = async (req, res)=>{
    let {id} = req.params;
    /* let {title, description, image, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id, {
        title : title,
        description : description,
        image : image,
        price : price,
        location : location,
        country : country
    }); */


    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});  // we are using 'rest' to deconstruct all the individual values in an object 'listing'
    // as we've used object 'listing' to store all the data, we've to name all the parameters as listing[title], listing[description], listing[price].... in 'edit.ejs' HTML code


    // adding upload image feature in edit page.
    if(typeof req.file !== "undefined"){   // so that incase if the user don't add image in the edit page then the old image remains in the req.file
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Listing updated!")
    res.redirect(`/listings/${id}`); 
}


module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing : ",deletedList);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}