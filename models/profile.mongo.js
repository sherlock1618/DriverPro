const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    role: { type: String, enum: ['client', 'driver'], required: true, default: 'client' }
});

module.exports = mongoose.model('Profile', profileSchema);