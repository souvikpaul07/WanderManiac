const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
// const wrapAsync = require("./utils/wrapAsync.js");
// const {listingSchema} = require("./Schema.js");
// const {reviewSchema} = require("./Schema.js");
// const Review = require("./models/review.js");
// const Listing = require("./models/listing.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



// .env
//require('dotenv').config();
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const MongoStore = require('connect-mongo'); // mongo store for sessions
const session = require("express-session"); // implementing express-session
const flash = require("connect-flash"); // implementing connect-flash

const listings = require("./routes/listings.js");   // requiring listings routes from routes folder
const reviews = require("./routes/reviews.js")  // requiring reviews routes from routes folder
const userSignUp = require("./routes/userSignUp.js");  // requiring userSignUp routes from routes folder

//const mongoUrl = "mongodb://127.0.0.1:27017/wanderManiac";
const DB_url = process.env.ATLASDB_URL;  // shifting the database to MongoATLAS
async function main(){
    // await mongoose.connect(mongoUrl);
    await mongoose.connect(DB_url);
}

main()
    .then((res)=>{console.log("mongoDB connection successful")})
    .catch((err)=>{console.log(err)});

app.use(express.static(path.join(__dirname, "/public")));

// method-override : to use 'PUT' , 'DELETE' & 'PATCH' request with forms
app.use(methodOverride("_method"));


// ejs-mate : to create multiple templates
app.engine("ejs", ejsMate);




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));

// Root
app.get("/", (req, res)=>{
    res.redirect("/listings");
})



// shifting to mongoStore for sessions. As express session is not suitable for production base
const store = MongoStore.create({
    mongoUrl : DB_url,
    crypto : {
        secret : process.env.SESSION_SECRET
    },
    touchAfter : 24 * 3600  // keeps the session till mention Seconds
})

store.on("error", ()=>{
    console.log("ERROR in MongoStore", err);
})

// implementing express-session
const sessionOptions = {
    store : store,
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true
    }
}

app.use(session (sessionOptions));


// implementing connect-flash
app.use(flash());



// passport implement
app.use(passport.initialize()); // middleware that initializes passport
app.use(passport.session()); // A web application needs the ability to identify users as they browse from page to page. This series with request & response associated with the same user, is called Session.
passport.use(new LocalStrategy(User.authenticate())); // All the users & requests should be authenticated through LocalStrategy. Where User.authenticate() function will authenticate the users.


passport.serializeUser(User.serializeUser());   // Seriliazes users into session. That means stores all user related data.
passport.deserializeUser(User.deserializeUser());  // Unstores/removes the data once the session is over.


//middlewares
app.use((req, res, next)=>{  // flash middleware
    res.locals.successFlashMsg = req.flash("success");
    res.locals.errorFlashMsg = req.flash("error");
    res.locals.currUser = req.user;  // res.locals for signup, login & logout condition (see navbar.ejs)
    next();
})

// adding the routes
app.use("/listings", listings);
app.use("/listings/:id/review", reviews);
app.use("/", userSignUp);

// demoUser
// app.get("/demoUser", async(req, res)=>{
//     let demoUser = {
//         username : "Souvik0777",
//         email : "abc@gmail.com"
//     }

//     let registeredUser = await User.register(demoUser, "12345678Sp");   // User.register(user, password, callback);
//     res.send(registeredUser);
// })


// Error Handlers

app.all("*", (req, res, next)=>{   // If the Route doesn't exist
    next(new expressError(404, `Oops! page not found!`));
})


app.use((err, req, res, next)=>{
    let{statusCode, message} = err;
    res.status(statusCode=500).render("error.ejs", {message});
})


// server
app.listen(8080, ()=>{
    console.log("Server is listening to port :", 8080);
})