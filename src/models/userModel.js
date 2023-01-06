const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
   
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)