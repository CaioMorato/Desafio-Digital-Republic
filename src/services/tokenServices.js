const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET;

const generateToken = (payload) => {
  const token = jwt.sign(payload, SECRET, {
    expiresIn: '20m',
  });

  return token;
};

const getPayload = (token) => {
  const payload = jwt.verify(token, SECRET);

  return payload;
};

module.exports = { generateToken, getPayload };
