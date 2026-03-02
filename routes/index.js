const router = require('express').Router();
const userRouter = require('./users');
const clothingItemRouter = require('./clothingItems');
const { createUser, login } = require('../controllers/users');
const { getItems } = require('../controllers/clothingItems');
const { auth } = require('../middlewares/auth');
const { validateUserSignup, validateUserSignin } = require('../middlewares/validation');

// Authentication routes with validation
router.post('/signin', validateUserSignin, login);
router.post('/signup', validateUserSignup, createUser);

// Public route for items
router.get('/items', getItems);

// Protected routes
router.use('/users', auth, userRouter);
router.use('/items', auth, clothingItemRouter);

module.exports = router;
