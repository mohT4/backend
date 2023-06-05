const winston = require('winston');

function buildDevLogger() {
  const formatLoger = winston.format.printf(
    ({ level, message, timestamp, stack }) => {
      return `${timestamp} ${level}: ${message} || ${stack}`;
    }
  );

  return winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD  HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      formatLoger
    ),
    transports: [new winston.transports.Console()],
  });
}

module.exports = buildDevLogger;
