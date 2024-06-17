const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); //required User model
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewares.js");

const userController = require("../Controllers/user.js");

// Sign Up
router.get("/signUp", userController.renderSignUpForm);

router.post("/signUp", wrapAsync(userController.signUp));


// Log In
router.get("/login", userController.renderLoginForm);

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), // It's a middleware for user authentication and it does the login process
    userController.logIn
)


// log out
router.get("/logout", userController.logOut)

module.exports = router;