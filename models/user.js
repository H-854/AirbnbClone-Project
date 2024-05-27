const { required } = require('joi');
const mongoose = require('mongoose');
const { use } = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type:  String,
        required: true
    }
})
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);