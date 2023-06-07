const logger = require('../utils/logger');

const sendDevErr = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdErr = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    logger.error(err.message);
  }
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') sendDevErr(err, res);
  else if (process.env.NODE_ENV === 'production') sendProdErr(err, res);
};
