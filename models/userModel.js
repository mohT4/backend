const mongoose = require('mongoose');
const joi = require('joi');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: {
      type: String,
      select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.virtual('passwordConfirmation').set(function (value) {
  this._passwordConfirmation = value;
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

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
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  return next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.correctPassword = async function (
  givenPassword,
  userPassword
) {
  return await bcrypt.compare(givenPassword, userPassword);
};

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
