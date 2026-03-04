const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/request.log' }),
    ...(process.env.NODE_ENV !== 'production' 
      ? [new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })]
      : []
    ),
  ],
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: "error.log", format: winston.format.json() }),
  ],
});

module.exports = (req, res, next) => {
  requestLogger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });
  next();
};

module.exports.errorLogger = errorLogger;
