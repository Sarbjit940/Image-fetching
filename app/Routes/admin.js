const  path = require('path');
const express = require('express');
const app = express();
const router = express.Router();

const adminController = require('../Controllers/adminController');
const authController = require('../Middleware/auth');

//payment debit card and credit card
router.get('/fetch', authController.apiAuth, adminController.imageFetech);
module.exports = router;