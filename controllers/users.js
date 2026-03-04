const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_SECRET } = require('../utils/config');
const logger = require('../utils/logger');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      logger.info(`User ${user._id} retrieved successfully`);
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('User not found'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid user ID'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      logger.info(`New user created: ${user.email}`);
      res.status(201).send(userResponse);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('User with this email already exists'));
      }
      if (err.name === 'BadRequestError') {
        return next(new BadRequestError('Invalid data provided'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      logger.info(`User logged in: ${user.email}`);
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'Incorrect email or password') {
        return next(new UnauthorizedError('Incorrect email or password'));
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      logger.info(`User profile updated: ${user._id}`);
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('User not found'));
      }
      if (err.name === 'BadRequestError') {
        return next(new BadRequestError('Invalid data provided'));
      }
      return next(err);
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
