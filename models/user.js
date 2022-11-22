const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalmongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});

UserSchema.plugin(passportLocalmongoose);

const User = mongoose.model('User', UserSchema);

module.exports = User;