const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema ({
    email : {
        type : String,
        require : true
    }
});
// You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the ("pbkdf2 Argorithm") hashed password and the salt value.

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);