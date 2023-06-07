const winston = require('winston');

function buildProdLogger() {
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'under-service' },
    transports: [new winston.transports.Console()],
  });
}

module.exports = buildProdLogger;
