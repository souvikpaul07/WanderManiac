const Listing = require("./models/listing");
const Review = require("./models/review");


module.exports.isLoggedIn = (req, res, next) =>{
    // console.log(req.user)  // If not logged in then it'll print "undefined".
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;   // so that if user wants to create a listing but he hasn't logged in yet.. Then once he logs in then he directly go to the "create listings" page.
        req.flash("error", "You must be logged in");
        return res.redirect("/login");  // if not logged in before "adding, editing, deleting listings" then the page will be redirected to "login" page
    }
    next();
}

// now the problem is "passport" resets the "req.session" once it authenticates user. That's why we need to create a middleware and save the "req.session.redirectUrl" to "res.locals" , as passport doesn't have access to "res.locals"

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){        // if "req.session.redirectUrl" exists then
        res.locals.redirectUrl = req.session.redirectUrl;  // then save it in the "res.locals"
    }

    next();
}



// For Authorization process before listing editing or listing deleting
module.exports.isOwner = async(req, res, next) =>{
    let {id} =  req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// For Authorization process before reviews editing or reviews deleting
module.exports.isReviewAuthor = async(req, res, next) =>{
    let {id, reviewId} = req.params;
    let reviews = await Review.findById(reviewId);
    if(res.locals.currUser && !reviews.author.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}