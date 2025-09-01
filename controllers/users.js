const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors');

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

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  
  User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid data provided' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
