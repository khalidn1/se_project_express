const logger = require('../utils/logger');

const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = ERROR_CODES.BAD_REQUEST;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = ERROR_CODES.UNAUTHORIZED;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = ERROR_CODES.FORBIDDEN;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = ERROR_CODES.NOT_FOUND;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = ERROR_CODES.CONFLICT;
  }
}

const errorHandler = (err, req, res, next) => {
  let { statusCode = ERROR_CODES.INTERNAL_SERVER_ERROR, message } = err;

  if (err.name === 'CastError') {
    statusCode = ERROR_CODES.BAD_REQUEST;
    message = 'Invalid data format';
  } else if (err.name === 'ValidationError') {
    statusCode = ERROR_CODES.BAD_REQUEST;
    message = Object.values(err.errors).map(error => error.message).join(', ');
  } else if (err.code === 11000) {
    statusCode = ERROR_CODES.CONFLICT;
    message = 'Email already exists';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = ERROR_CODES.UNAUTHORIZED;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = ERROR_CODES.UNAUTHORIZED;
    message = 'Token expired';
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  if (statusCode === ERROR_CODES.INTERNAL_SERVER_ERROR) {
    message = 'An error occurred on the server';
  }

  res.status(statusCode).send({ message });
};

module.exports = {
  errorHandler,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ERROR_CODES,
};
