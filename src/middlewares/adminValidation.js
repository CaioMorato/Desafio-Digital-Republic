const { StatusCodes } = require('http-status-codes');
const adminServices = require('../services/adminServices');
const crypto = require('crypto-js');

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
  }
};

const adminNotFound = async (req, res, next) => {
  try {
    const { email } = req.body;
    const findAccount = await adminServices.findAdmin(email);

    if (!findAccount) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Verifique o e-mail digitado e tente novamente',
      });
    }

    next();
  } catch (err) {
    console.log(err);
  }
};

const passwordMatch = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [findAccount] = await adminServices.findAdmin(email);

    // This will convert the request password into a 'WordArray', then the 'WordArray' into the hash itself, so we can compare with the saved hashed password.
    const encryptedPass = crypto.MD5(password).toString(crypto.enc.Hex);

    if (encryptedPass !== findAccount.password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Senhas não correspondem' });
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { adminAlreadyExists, adminNotFound, passwordMatch };
