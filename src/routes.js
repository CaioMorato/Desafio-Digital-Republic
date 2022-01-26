const express = require('express');
const accountRoutes = express.Router();
const accountController = require('./controllers/accountController');

accountRoutes.post('/account', accountController.newAccount);

module.exports = accountRoutes;
