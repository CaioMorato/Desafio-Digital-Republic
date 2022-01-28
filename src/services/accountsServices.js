const UserAccount = require('../models/UserAccount');

const findUser = async (cpf) => {
  try {
    // change function for not to return array
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

const depositBalance = async (cpf, amount) => {
  try {
    const findAccountUpdateBalance = await UserAccount.findOneAndUpdate(
      { cpf },
      { $inc: { balance: amount } },
      { new: true }
    );

    return findAccountUpdateBalance;
  } catch (err) {
    console.log(err);
  }
};

const transferBalance = async (cpf, receiver, amount) => {
  try {
    const removeBalance = await UserAccount.findByIdAndUpdate(
      { cpf },
      { $inc: { balance: -amount } },
      { new: true }
    );

    const addBalance = await UserAccount.findByIdAndUpdate(
      { receiver },
      { $inc: { balance: amount } },
      { new: true }
    );

    return removeBalance;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { newAccount, findUser, depositBalance, transferBalance };
