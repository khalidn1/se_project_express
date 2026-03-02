const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');

const routes = require('./routes');
const requestLogger = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();
const { PORT = 3001, NODE_ENV = 'development' } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', { error: err.message });
  });

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

app.use(cors());

app.use(requestLogger);

app.use(express.json({ limit: '10mb' }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use('/', routes);

app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});
