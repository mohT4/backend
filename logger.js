const winston = require('winston');

const formatLoger = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD  HH:mm:ss' }),
    formatLoger
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
