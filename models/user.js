// setup mongoose and passport
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// define user model
const UserSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// adds username, password, and validations to user model
UserSchema.plugin(passportLocalMongoose);

// export user model
module.exports = mongoose.model('User', UserSchema);