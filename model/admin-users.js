const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const adminUser = mongoose.model('adminUser', adminSchema);
module.exports = adminUser;