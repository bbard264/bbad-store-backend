const express = require('express');
const app = express();

app.use('/images', express.static('photo'));

app.get('/', (req, res) => {
  const htmlContent = '<img src="/images/testphoto.jpg" alt="Test Photo" />';
  res.send(htmlContent);
});

module.exports = app;
