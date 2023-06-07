const express = require('express');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const logger = require('./utils/logger');

const userRouter = require('./routes/userRouter');

const app = express();

app.use('/api/v1/user', userRouter);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
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
