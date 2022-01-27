const UserAccount = require('../models/UserAccount');

const findUser = async (cpf) => {
  try {
    const findUser = await UserAccount.find({ cpf });
    if (findUser.length === 0) {
      return false;
    }

    return findUser;
  } catch (err) {
    console.log(err);
  }
};

const newAccount = async (name, cpf, saldo) => {
  try {
    const createUser = await UserAccount.create({ name, cpf, saldo });

    if (!createUser) {
      return false;
    }

    return createUser;
  } catch (err) {
    console.log(err);
  }
};

const depositBalance = async (cpf, amount) => {
  const findAccountUpdateBalance = await UserAccount.findOneAndUpdate({ cpf });
};

module.exports = { newAccount, findUser, depositBalance };
