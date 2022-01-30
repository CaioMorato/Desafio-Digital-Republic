const { StatusCodes } = require('http-status-codes');
const accountServices = require('../services/accountsServices');
const { getPayload } = require('../services/tokenServices');

const userAlreadyExists = async (req, res, next) => {
  try {
    const { cpf } = req.body;
    const findAccount = await accountServices.findUser(cpf);

    if (findAccount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Já existe um usuário com este CPF cadastrado' });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const userNotFound = async (req, res, next) => {
  try {
    const { cpf } = req.params;

    const findAccount = await accountServices.findUser(cpf);

    if (!findAccount) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Verifique o CPF digitado e tente novamente' });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const receiverNotFound = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const { receiver } = req.body;

    const { cpf } = getPayload(authorization);

    const findAccount = await accountServices.findUser(receiver);

    if (!findAccount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Verifique o CPF do destinatário e tente novamente' });
    }

    if (cpf === receiver) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Você não pode transferir dinheiro para sua própria conta. Digite outro CPF',
      });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { userAlreadyExists, userNotFound, receiverNotFound };
