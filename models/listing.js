const mongoose = require("mongoose");
const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        url : String,
        filename : String    
    },
    price : {
        type : Number,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"  // reference : "Review" model
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"   // reference : "User" model
    },

    geometry : {  // to store the map coordinates for different locations--> GeoJson : https://mongoosejs.com/docs/geojson.html
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    }
})


// to delete the review array if the listing is deleted.
listingSchema.post("findOneAndDelete", async(listing)=>{  //findOneAndDelete --> Post Mongoose Middleware
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}}); //all the review_id in listing.reviews Array will be deleted
    }
})

// created Listing Model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;