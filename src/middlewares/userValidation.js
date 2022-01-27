const { StatusCodes } = require('http-status-codes');
const accountServices = require('../services/accountsServices');

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

module.exports = { userAlreadyExists };
