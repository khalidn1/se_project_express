const router = require('express').Router();
const userRouter = require('./users');
const clothingItemRouter = require('./clothingItems');
const { createUser, login } = require('../controllers/users');
const { getItems } = require('../controllers/clothingItems');
const { auth } = require('../middlewares/auth');
const { NOT_FOUND } = require('../utils/errors');

router.post('/signin', login);
router.post('/signup', createUser);
router.get('/items', getItems);

router.use('/users', auth, userRouter);
router.use('/items', auth, clothingItemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found' });
});

module.exports = router;
