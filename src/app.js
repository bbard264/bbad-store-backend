const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

require('./config/passport/passport');

app.use('/images', express.static('./images'));
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
