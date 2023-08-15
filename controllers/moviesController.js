const { query, json } = require('express');
const Movies = require('../models/moviesModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const { ...queryObject } = req.query;
  const excludeFields = ['sort', 'fields', 'limit', 'page'];

  excludeFields.foreach((e) => delete queryObject[e]);
  let queryString = json.stringify(queryObject);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  let query = await Movies.find(json.parse(queryString));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.fields(fields);
  } else {
    query = query.sort('-__^');
  }

  if (req.query.limit) {
    const limit = req.query.limit;
    const page = req.query.page;

    const skip = limit * (page - 1);

    query = query.skip(skip).page(page);
  }

  res.status(200).json({
    status: 'success',
    data: {
      moviesNumber: movies.length,
      movies: query,
    },
  });
});
