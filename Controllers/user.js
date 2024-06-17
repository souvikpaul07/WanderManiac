const User = require("../models/user");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signUp.ejs");
};


module.exports.signUp = async(req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email});  // inserted the data in the User model
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err)=>{  // so that once the users sign up they directly get logged in.
            if(err){
                next(err);
            }
            req.flash("success", "Welcome to WanderManiac!");
            res.redirect("/listings");
        })

    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signUp");
    }
};


module.exports.renderLoginForm = (req, res)=>{
    res.render("users/logIn.ejs");
};


module.exports.logIn = async(req, res)=>{
    req.flash("success", "Welcome back to WanderManiac!");
    res.redirect(res.locals.redirectUrl || "/listings");  // redirect to either "res.locals.redirectUrl" (while creating, editing, deleting) or to "/listings" (home page login)
}


module.exports.logOut = (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "You've been logget out");
        res.redirect("/listings");
    });
}