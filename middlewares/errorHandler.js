const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const errorHandler = (err, req, res, next) => {
  
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "An error has occurred on the server" : err.message;
  res.status(statusCode).send({ message });
};

module.exports = {
  errorHandler,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
