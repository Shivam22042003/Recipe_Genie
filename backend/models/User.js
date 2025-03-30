const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    savedRecipes: Array,
});

module.exports = mongoose.model('User', UserSchema);
