const express = require('express');
const adminRoutes = express.Router();

const adminController = require('../controllers/adminController');
const {
  adminAlreadyExists,
  adminNotFound,
  passwordMatch,
} = require('../middlewares/adminValidation');

adminRoutes.post('/admin', adminAlreadyExists, adminController.newAccount);

adminRoutes.put('/admin', adminNotFound, passwordMatch, adminController.loginAdmin);

// adminRoutes.get('/admin/:email', adminNotFound);

module.exports = adminRoutes;
