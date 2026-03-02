const router = require('express').Router();
const userRouter = require('./users');
const clothingItemRouter = require('./clothingItems');
const { createUser, login } = require('../controllers/users');
const { getItems } = require('../controllers/clothingItems');
const { auth } = require('../middlewares/auth');
const { validateUserSignup, validateUserSignin } = require('../middlewares/validation');

router.post('/signin', validateUserSignin, login);
router.post('/signup', validateUserSignup, createUser);

router.get('/items', getItems);

router.use('/users', auth, userRouter);
router.use('/items', auth, clothingItemRouter);

module.exports = router;
