const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const logger = require('./utils/logger');
const userRouter = require('./routes/userRouter');
const moviesRouter = require('./routes/moviesRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const httpLoger = require('./middlewares/httpLoger');

dotenv.config();
const app = express();

app.use(express.json());

app.use(httpLoger);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/movies', moviesRouter);
app.use('*', (req, res, next) =>
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404))
);
app.use(globalErrorHandler);

const DB = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('database connection established'));

const port = process.env.PORT;
app.listen(port, () => {
  logger.info(`listening on port ${port}`);
});
