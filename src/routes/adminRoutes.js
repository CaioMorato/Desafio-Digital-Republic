const express = require('express');
const adminRoutes = express.Router();

const adminController = require('../controllers/adminController');
const { adminAlreadyExists } = require('../middlewares/adminValidation');

adminRoutes.post('/admin', adminAlreadyExists, adminController.newAccount);

module.exports = adminRoutes;
