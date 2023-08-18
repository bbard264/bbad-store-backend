const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

require('./config/passport/passport');

const originalConsoleLog = console.log;

console.log = (...args) => {
  const currentDateTime = new Date().toLocaleString();
  originalConsoleLog(`[${currentDateTime}]`, ...args);
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/images', express.static('./images', { maxAge: 86400 }));
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/review', reviewRoutes);

module.exports = app;
