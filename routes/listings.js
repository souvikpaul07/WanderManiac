const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../Schema.js")
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middlewares.js");
const {isOwner} = require("../middlewares.js");

const listingController = require("../Controllers/listing.js");


// for image uploading --> multer : https://www.npmjs.com/package/multer
const multer  = require('multer')


const {storage} = require("../cloudConfig.js");
//const upload = multer({ dest: 'uploads/' }) //{dest : 'uploads/'} => destination : 'uploads' folder. A local folder named "uploads" will be created and there multer will save the uploaded files
const upload = multer({storage});  // now multer will save the uploaded images in cloud (cloudinary account) storage




// server side error for listing : Middleware
const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg=error.details.map((el)=>{ return el.message})  // to access the "error details message" and display the message if any error occurs.
        throw new expressError(400, errMsg);
    } else{
        next();
    }
}

/******** Routes *******/

// Index route
// router.get("/", wrapAsync(async(req, res)=>{
//     const allListings = await Listing.find({});   // find all the listings
//     res.render("listings/index.ejs", {allListings});
// }))    //MOVED TO "controller--> listing.js" file

// Index route
router.get("/", 
    wrapAsync(listingController.index)
);


// New route
router.get("/new", isLoggedIn, listingController.renderNewForm)        // isLoggedIn middlware defined in middlewares.js file

// Create route
router.post("/",
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);



// Show route
router.get("/:id", 
    wrapAsync(listingController.showListing)
);
// if we add show route before the new route then 'new' will be treated as ':id'. Hence it'll throw error


// Edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

// Update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing)
);


// Delete route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);


module.exports = router;