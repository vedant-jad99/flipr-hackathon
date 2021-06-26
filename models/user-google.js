const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    googleId: String,
    email:String,
    thumbnail: String
});

const User = mongoose.model('user-google', userSchema);

module.exports = User;