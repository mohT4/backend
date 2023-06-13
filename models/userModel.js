const mongoose = require('mongoose');

// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide your name '],
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    lowercase: true,
  },
  password: {
    required: [true, 'please provide your password'],
    minlength: 8,
    select: false,
    validate: [validator.isEmail, 'please provide a valid email'],
    unique: [true, 'this email is already in use'],
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'please provide your password'],
    validator: function (el) {
      return el === this.password;
    },
    message: 'password does not match',
  },
});

const User = mongoose.Model('User', userSchema);

module.exports = User;
