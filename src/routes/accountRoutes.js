const express = require('express');
const accountRoutes = express.Router();
const accountController = require('../controllers/accountController');
const tokenValidation = require('../middlewares/tokenValidation');
const { userAlreadyExists } = require('../middlewares/userValidation');

accountRoutes.post('/account', userAlreadyExists, accountController.newAccount);
accountRoutes.put('/login/:cpf', accountController.userLogin);
accountRoutes.post('/deposit', tokenValidation, accountController.depositBalance);

module.exports = accountRoutes;
