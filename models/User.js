const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String },
    phonenumber: { type: String },
    password: { type: String, required: true },
    isadmin: {type: Boolean, required: true}
});

module.exports = mongoose.model('User', UserSchema);
