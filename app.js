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

// Database connection with error handling
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', { error: err.message });
  });

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// CORS
app.use(cors());

// Request logging
app.use(requestLogger);

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Crash test endpoint (remove after review)
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

// Routes
app.use('/', routes);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

// Celebrate error handler
app.use(errors());

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});
