const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/images', express.static('./images'));
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);

module.exports = app;
