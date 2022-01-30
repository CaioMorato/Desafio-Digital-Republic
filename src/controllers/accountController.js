const { StatusCodes } = require('http-status-codes');
const userInfoValidation = require('../validations/userInfoValidation');
const accountServices = require('../services/accountsServices');

const { generateToken, getPayload } = require('../services/tokenServices');

const newAccount = async (req, res) => {
  try {
    const { name, cpf, balance } = req.body;

    const { error } = userInfoValidation.validate({ name, cpf, balance });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
    }

    const createUser = await accountServices.newAccount(name, cpf, balance);

    if (!createUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Verifique os dados digitados e tente novamente',
      });
    }

    return res.status(StatusCodes.CREATED).json({
      message: 'Conta criada com Sucesso! Boas vindas ao DRBank!',
      data: {
        name,
        cpf,
        balance: createUser.balance,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const userLogin = async (req, res) => {
  try {
    const { cpf } = req.params;

    const token = generateToken({ cpf });

    return res.status(StatusCodes.OK).json({ token });
  } catch (err) {
    console.log(err);
  }
};

const depositBalance = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { amount } = req.body;

    if (amount <= 0 || amount > 2000 || typeof amount !== 'number') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          'O valor de depósito deve ser um valor numérico maior que 0 e menor ou igual a 2000',
      });
    }

    const { cpf } = getPayload(authorization);

    const { balance } = await accountServices.depositBalance(cpf, amount);

    return res.status(StatusCodes.CREATED).json({
      message:
        'Seu depósito foi efetuado e seu saldo foi atualizado! Obrigado por usar nossos serviços.',
      balance,
    });
  } catch (err) {
    console.log(err);
  }
};

const transferBalance = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { receiver, amount } = req.body;

    const { cpf } = getPayload(authorization);

    const { balance } = await accountServices.transferBalance(cpf, receiver, amount);

    return res.status(StatusCodes.OK).json({
      message:
        'Sua transferência foi realizada e seu saldo foi atualizado! Obrigado por usar nossos serviços.',
      balance,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { newAccount, userLogin, depositBalance, transferBalance };
