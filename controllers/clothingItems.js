const ClothingItem = require('../models/clothingItem');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, FORBIDDEN } = require('../utils/errors');

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid data provided' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res.status(FORBIDDEN).send({ message: 'You can only delete your own items' });
      }
      return ClothingItem.findByIdAndDelete(itemId)
        .then((deletedItem) => res.send(deletedItem));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Item not found' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid item ID' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Item not found' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid item ID' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Item not found' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid item ID' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'An error has occurred on the server.' });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
