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

const newAccount = async (name, cpf, balance) => {
  try {
    const createUser = await UserAccount.create({ name, cpf, balance });

    if (!createUser) {
      return false;
    }

    return createUser;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { newAccount, findUser };
