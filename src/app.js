const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

require('./config/passport/passport');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const logRequests = (req, res, next) => {
  console.log('Received request:', req.url);
  next();
};

app.use('/images', logRequests, express.static('./images', { maxAge: 86400 }));
app.use('/api/product', logRequests, productRoutes);
app.use('/api/category', logRequests, categoryRoutes);
app.use('/api/user', logRequests, userRoutes);
app.use('/api/order', logRequests, orderRoutes);
app.use('/api/review', logRequests, reviewRoutes);

module.exports = app;
