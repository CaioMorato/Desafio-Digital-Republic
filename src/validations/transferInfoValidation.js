const Joi = require('joi');

const transferInfoValidation = Joi.object({
  sender: Joi.string().required().length(11).message('Digite um CPF válido'),
  receiver: Joi.string().required().length(11).message('Digite um CPF válido'),
  amount: Joi.number().required(),
});

module.exports = transferInfoValidation;
