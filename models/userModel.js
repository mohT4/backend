const mongoose = require('mongoose');
const joi = require('joi');

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  passwordConfirmation: String,
});

userSchema.pre('save', async function (next) {
  try {
    await joi
      .object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
        passwordConfirmation: joi
          .string()
          .valid(joi.ref('password'))
          .required()
          .message({
            'any.only': ' password do not match',
          }),
      })
      .validateAsync(this.toObject());
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.Model('User', userSchema);

module.exports = User;
