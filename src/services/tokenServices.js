const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET;

const generateToken = (cpf) => {
  const payload = { cpf };

  const token = jwt.sign(payload, SECRET, {
    expiresIn: '10m',
  });

  return token;
};

const validateToken = (token) => {
  if (!token) {
    return false;
  }

  const payload = jwt.verify(token, SECRET);

  return payload;
};

module.exports = { generateToken, validateToken };
