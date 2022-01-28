const express = require('express');
const accountRoutes = express.Router();
const accountController = require('../controllers/accountController');
const tokenValidation = require('../middlewares/tokenValidation');
const {
  userAlreadyExists,
  userNotFound,
  receiverNotFound,
} = require('../middlewares/userValidation');
const { transferAmount } = require('../middlewares/transferValidation');

// create account
accountRoutes.post('/account', userAlreadyExists, accountController.newAccount);

// login to make operations
accountRoutes.put('/login/:cpf', userNotFound, accountController.userLogin);

// deposit money
accountRoutes.post('/deposit', tokenValidation, accountController.depositBalance);

// transfer money
accountRoutes.post(
  '/transfer',
  tokenValidation,
  receiverNotFound,
  transferAmount,
  accountController.transferBalance
);

module.exports = accountRoutes;
