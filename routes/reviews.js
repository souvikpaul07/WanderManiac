const express = require("express");
const router = express.Router({mergeParams : true}); // To keep the parent 'req.params' , we need to add { mergeParams: true } in to the 'child router'.

const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {reviewSchema} = require("../Schema.js");
const Listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");
const { isLoggedIn, isReviewAuthor } = require("../middlewares.js");

const reviewController = require("../Controllers/review.js");



// server side error for reviews : Middleware
const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg = error.details.map((el)=> {return el.message}) // to access the "error details message" and display the message if any error occurs.
        throw new expressError(400, errMsg);
    } else{
        next();
    }
}



/****** Reviews Post Route (new review) ******/
router.post("/", isLoggedIn, validateReview , wrapAsync(reviewController.createReview));



/******** Reviews Delete Route ********/
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;