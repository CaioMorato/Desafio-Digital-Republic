const { StatusCodes } = require('http-status-codes');
const adminServices = require('../services/adminServices');

const adminAlreadyExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    const findAccount = await adminServices.findAdmin(email);

    if (findAccount) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          'Já existe um administrador com esse email cadastrado. Verifique os dados e tente novamente',
      });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { adminAlreadyExists };
