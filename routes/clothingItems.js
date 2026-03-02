const router = require('express').Router();
const { getItems, createItem, deleteItem, likeItem, dislikeItem } = require('../controllers/clothingItems');
const { validateClothingItem, validateId } = require('../middlewares/validation');

router.get('/', getItems);
router.post('/', validateClothingItem, createItem);
router.delete('/:itemId', validateId, deleteItem);
router.put('/:itemId/likes', validateId, likeItem);
router.delete('/:itemId/likes', validateId, dislikeItem);

module.exports = router;
