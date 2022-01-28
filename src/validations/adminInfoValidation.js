const Joi = require('joi');

const adminInfoValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

module.exports = adminInfoValidation;
