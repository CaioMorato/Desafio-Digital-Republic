const { StatusCodes } = require('http-status-codes');
const adminInfoValidation = require('../validations/adminInfoValidation');
const adminServices = require('../services/adminServices');

// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN
// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN
// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN
// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN
// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN
// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN
// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN
// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN
// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN
// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN
// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN
// COLOCAR CHECKOUT DA CONTA PRA APARECER NO RETORNO USUARIO E ADMIN

const newAccount = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { error } = adminInfoValidation.validate({ name, email, password });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
    }

    const createUser = await adminServices.newAccount(name, email, password);

    if (!createUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Verifique os dados digitados e tente novamente',
      });
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'Conta criada com Sucesso! Boas vindas ao DRBank!', data: { name, email } });
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { newAccount };
