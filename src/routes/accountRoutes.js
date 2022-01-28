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

accountRoutes.post('/account', userAlreadyExists, accountController.newAccount);

accountRoutes.put('/login/:cpf', userNotFound, accountController.userLogin);

accountRoutes.post('/deposit', tokenValidation, accountController.depositBalance);

accountRoutes.post(
  '/transfer',
  tokenValidation,
  receiverNotFound,
  transferAmount,
  accountController.transferBalance
);

module.exports = accountRoutes;
