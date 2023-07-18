const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/getCategoryList&Lastpage', categoryController.getCategoryLastPage);

module.exports = router;
