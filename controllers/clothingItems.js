const ClothingItem = require('../models/clothingItem');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const logger = require('../utils/logger');

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      logger.info(`Retrieved ${items.length} clothing items`);
      res.send(items);
    })
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      logger.info(`New clothing item created: ${item._id} by user ${req.user._id}`);
      res.send(item);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Invalid data provided'));
      }
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError('You can only delete your own items');
      }
      return ClothingItem.findByIdAndDelete(itemId)
        .then((deletedItem) => {
          logger.info(`Clothing item deleted: ${itemId} by user ${req.user._id}`);
          res.send(deletedItem);
        });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item not found'));
      }
      if (err.name === 'CastError') {
        return next(new ValidationError('Invalid item ID'));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      logger.info(`Item liked: ${item._id} by user ${req.user._id}`);
      res.send(item);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item not found'));
      }
      if (err.name === 'CastError') {
        return next(new ValidationError('Invalid item ID'));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      logger.info(`Item unliked: ${item._id} by user ${req.user._id}`);
      res.send(item);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Item not found'));
      }
      if (err.name === 'CastError') {
        return next(new ValidationError('Invalid item ID'));
      }
      return next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
