const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //check if the email and password exists
    if (!email || !password)
      return next(new AppError('please enter your email and password', 400));

    //check if the user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError('invalid password or email ', 400));

    // send token to the user
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token: token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(new AppError(err, 400));
    logger.error(err);
  }
};
