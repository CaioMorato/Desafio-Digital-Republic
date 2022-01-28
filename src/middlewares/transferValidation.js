const { StatusCodes } = require('http-status-codes');
const accountServices = require('../services/accountsServices');
const { getPayload } = require('../services/tokenServices');

const transferAmount = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const { receiver, amount } = req.body;

    const { cpf } = getPayload(authorization);

    const [senderAccount] = await accountServices.findUser(cpf);

    if (senderAccount.balance - amount < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          'O saldo restante de sua conta não pode ser menor que 0. Verifique o valor e tente novamente',
        balance: senderAccount.balance
      });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { transferAmount };
