const { query, json } = require('express');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    user: user,
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  const queryObjct = { ...req.query };
  const excludeFildes = ['sort', 'limit', 'page', 'fields'];
  excludeFildes.forEach((el) => delete queryObjct[el]);

  let queryStrg = json.stringify(queryObjct);
  queryStrg = queryStrg.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  const query = await User.find(json.pasrs(queryStrg));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  if (req.query.fields) {
    const field = req.query.fields.split(',').join(' ');
    query = query.fields(field);
  } else {
    query = query.sort('-__^');
  }

  if (req.query.limit) {
    const limit = req.query.limit * 1 || 1;
    const page = req.query.page * 1 || 1;
    const skip = limit * (page - 1);
  }

  query = query.limit(skip).limit(limit);
  res.status(200).json({
    status: 'success',
    users: {
      Number: query.length,
      query,
    },
  });
});
