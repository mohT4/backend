const { query, json } = require('express');
const Movies = require('../models/moviesModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const { ...queryObject } = req.query;
  const excludeFields = ['sort', 'fields', 'limit', 'page'];

  excludeFields.forEach((e) => delete queryObject[e]);
  let queryString = JSON.stringify(queryObject);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  let query = Movies.find(JSON.parse(queryString));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('createdAt');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__^');
  }

  if (req.query.limit) {
    const limit = req.query.limit * 1 || 1;
    const page = req.query.page * 1 || 1;

    const skip = limit * (page - 1);

    query = query.skip(skip).limit(limit);
  }

  const movies = await query;
  res.status(200).json({
    status: 'success',
    data: {
      moviesNumber: movies.length,
      movies: movies,
    },
  });
});
