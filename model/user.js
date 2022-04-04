const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username: { type: String, unique: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String, select:false},
    phone: { type: Number },
    gender: { type: String },
    role: { type: String },
})

module.exports = mongoose.model('User', userSchema);