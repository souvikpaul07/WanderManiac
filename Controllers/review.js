const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    // creating new Review
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);

    // pushing all the newReviews in review array
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("New Review Saved!");

    req.flash("success", "New Review Created");
    res.redirect(`/listings/${req.params.id}`);
};



module.exports.destroyReview = async(req, res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});  // to delete the review from the review Array
    await Review.findByIdAndDelete(reviewId);  // to delete the review from the Listing

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}