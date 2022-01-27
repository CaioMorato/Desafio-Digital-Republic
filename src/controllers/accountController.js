const { StatusCodes } = require('http-status-codes');
const userInfoValidation = require('../validations/userInfoValidation');
const accountServices = require('../services/accountsServices');

const { generateToken } = require('../services/tokenServices');

const newAccount = async (req, res) => {
  try {
    const { name, cpf, saldo } = req.body;

    const { error } = userInfoValidation.validate({ name, cpf, saldo });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
    }

    const findAccount = await accountServices.findUser(cpf);

    if (findAccount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Já existe um usuário com este CPF cadastrado' });
    }

    const createUser = await accountServices.newAccount(name, cpf, saldo);

    if (!createUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Verifique os dados digitados e tente novamente',
      });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Conta criada com Sucesso! Boas vindas ao DRBank!' });
  } catch (err) {
    console.log(err);
  }
};

const userLogin = async (req, res) => {
  try {
    const { cpf } = req.params;

    const findAccount = await accountServices.findUser(cpf);

    if (!findAccount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Verifique o CPF digitado e tente novamente' });
    }

    const token = generateToken(cpf);

    return res.status(StatusCodes.OK).json({ token });
  } catch (err) {
    console.log(err);
  }
};

const depositBalance = async (req, res) => {
  const { cpf } = req.params;
  const { amount } = req.body;

  if (amount <= 0 || amount >= 2000) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'O valor de depósito ' });
  }

  const findAccount = await accountServices.findUser(cpf);

  if (!findAccount) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Verifique o CPF digitado e tente novamente' });
  }
};

module.exports = { newAccount, userLogin, depositBalance };
