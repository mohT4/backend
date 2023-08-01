const mongoose = require('mongoose');
const joi = require('joi');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.virtual('passwordConfirmation').set(function (value) {
  this._passwordConfirmation = value;
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
  try {
    const userObj = {
      name: this.name,
      email: this.email,
      password: this.password,
      passwordConfirmation: this._passwordConfirmation,
    };
    const schema = joi.object({
      name: joi.string().required(),
      email: joi.string().required(),
      password: joi.string().required(),
      passwordConfirmation: joi
        .string()
        .valid(joi.ref('password'))
        .required()
        .messages({
          'any.only': ' password do not match',
        }),
    });
    await schema.validateAsync(userObj);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  return next();
});

userSchema.methods.correctPassword = async function (
  givenPassword,
  userPassword
) {
  return await bcrypt.compare(givenPassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
