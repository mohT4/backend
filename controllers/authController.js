const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendMail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if the email and password exists
  if (!email || !password)
    return next(new AppError('please enter your email and password', 400));

  //check if the user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    logger.info(user.email === email);
    logger.info(password === user.password);
    return next(new AppError('invalid password or email ', 400));
  }

  //send token to the user
  const token = signToken(user._id);
  user.password = undefined;
  res.status(200).json({
    status: 'success',
    token: token,
    data: {
      user,
    },
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('invalid email address', 401));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send token to user

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/resetPassword/${resetToken}`;
  const message = `We wanted to let you know that you can change your password at any time to keep your account secure. To reset your password, please click on the following link:
  ${resetURL}`;
  try {
    await sendMail({
      email: user.email,
      subject: 'your password reset token (valid for now)',
      message: message,
    });
    logger.info(resetURL);
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email successfully!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    logger.info(resetURL);
    next(new AppError('there was a problem sending your password reset token'));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user from token

  const user = await User.findOne({
    passwordResetToken: req.params.token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    next(new AppError('Invalid password reset token. please try again', 400));

  //updatePassword
  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  user.passwordExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  signToken(user._id);
  res.status(200).json({
    status: 'success',
    message: 'passwords updated successfully',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await user.findOne(req.params.id).select('+password');

  if (!(await user.correctPassword(req.body.password, user.password)))
    return next(new AppError('password is incorrect', 400));

  user.password = req.body.newPassword;
  user._passwordConfirmation = req.body.passwordConfirmation;
  await user.save();

  signToken(user._id);
});
