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

  const { password: _, ...newPayload } = payload;

  return newPayload;
};

module.exports = { generateToken, getPayload };
