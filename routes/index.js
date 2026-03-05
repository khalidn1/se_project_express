const router = require('express').Router();
const userRouter = require('./users');
const clothingItemRouter = require('./clothingItems');
const { createUser, login } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { validateUserSignup, validateUserSignin } = require('../middlewares/validation');

router.post('/signin', validateUserSignin, login);
router.post('/signup', validateUserSignup, createUser);

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

router.use('/users', auth, userRouter);
router.use('/items', auth, clothingItemRouter);

router.use('*', auth, (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

module.exports = router;
