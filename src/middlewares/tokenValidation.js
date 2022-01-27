const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const SECRET = process.env.SECRET;

const tokenValidation = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token não encontrado' });
    }

    jwt.verify(authorization, SECRET, (err) => {
      if (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token inválido' });
      }
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = tokenValidation;
