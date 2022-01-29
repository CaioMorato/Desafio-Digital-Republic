const express = require('express');
const adminRoutes = express.Router();

const adminController = require('../controllers/adminController');
const {
  adminAlreadyExists,
  adminNotFound,
  passwordMatch,
} = require('../middlewares/adminValidation');
const tokenValidation = require('../middlewares/tokenValidation');

// create admin account
adminRoutes.post('/admin', adminAlreadyExists, adminController.newAccount);

// login admin accounts
adminRoutes.put('/admin', adminNotFound, passwordMatch, adminController.loginAdmin);

// check existing accounts
adminRoutes.get('/accounts', tokenValidation, adminController.getUsers);

// check transfers
adminRoutes.get('/transfers', tokenValidation, adminController.getTransfers);

module.exports = adminRoutes;
