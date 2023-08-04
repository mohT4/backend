const mongoose = require('mongoose');
const joi = require('joi');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');

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

userSchema.virtual('passwordResetToken').set(function (value) {
  this._passwordResetToken = value;
});

userSchema.virtual('passwordResetExpires').set(function (value) {
  this._passwordResetExpires = value;
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre(
  'save',
  catchAsync(async function (next) {
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
  })
);

userSchema.pre(
  'save',
  catchAsync(async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    return next();
  })
);

userSchema.methods.correctPassword = catchAsync(async function (
  givenPassword,
  userPassword
) {
  return await bcrypt.compare(givenPassword, userPassword);
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(16).toString('hex');
  _passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  _passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
