const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://127.0.0.1:27017/wanderManiac";
async function main(){
    await mongoose.connect(mongoUrl);
}
main()
    .then((res)=>console.log("MongoDB connection established"))
    .catch((err)=>console.log(err));


// created a function that deletes all the data in the database & then inserts the "data.js"'s data
const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner : "66635f4ea25eb88f3928fd8d"}));   // for owner Authorization. Used mapping with initData.data for each object, where we've passed the original object and added "owner" object Id. As "map" doesn't make changes in the original array,  rather it creates another array that's why we have stored it in the same variable "initData.data".
    
    await Listing.insertMany(initData.data); //accessing the "key" of initData object
    console.log("Data has been initialized");
}

initDB();