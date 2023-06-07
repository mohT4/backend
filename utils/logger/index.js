const buildDevlogger = require('./dev-logger');
const buildProdLogger = require('./prod-logger');

let logger;
if (process.env.NODE_ENV === 'development') {
  logger = buildDevlogger();
} else if (process.env.NODE_ENV === 'production') {
  logger = buildProdLogger();
}

module.exports = logger;
