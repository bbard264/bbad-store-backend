const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/getcategorylist', categoryController.getCategoryList);

module.exports = router;
