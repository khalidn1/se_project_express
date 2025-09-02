const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
