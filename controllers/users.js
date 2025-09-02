const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, CONFLICT, UNAUTHORIZED } = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid user ID' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid user ID' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      res.send(userResponse);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: 'User with this email already exists' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid data provided' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(UNAUTHORIZED).send({ message: 'Incorrect email or password' });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid data provided' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
