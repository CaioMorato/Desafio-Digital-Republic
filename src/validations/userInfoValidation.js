const Joi = require('joi');

const userInfoValidation = Joi.object({
  name: Joi.string().required(),
  cpf: Joi.string().required().length(11).message('Digite um CPF válido'),
  balance: Joi.number().optional(),
});

module.exports = userInfoValidation;
