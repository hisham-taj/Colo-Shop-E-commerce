
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  blocked: {
    type: Boolean,
    default: false
  }
});



const User = mongoose.model('User', userSchema);

module.exports = User;
