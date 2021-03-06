const AdminAccount = require('../models/AdminAccount');
const UserAccount = require('../models/UserAccount');
const TransferData = require('../models/TransferData');

const findAdmin = async (email) => {
  try {
    const getAdmin = await AdminAccount.find({ email });

    if (getAdmin.length === 0) {
      return false;
    }

    return getAdmin;
  } catch (err) {
    console.log(err);
  }
};

const newAccount = async (name, email, password) => {
  try {
    const createAdmin = await AdminAccount.create({ name, email, password });

    // This prevents the password to appear on the request. It will only appear, encrypted, on the database.
    createAdmin.password = undefined;

    if (!createAdmin) {
      return false;
    }

    return createAdmin;
  } catch (err) {
    console.log(err);
  }
};

const getUsers = async () => {
  try {
    const findUsers = await UserAccount.find({});

    return findUsers;
  } catch (err) {
    console.log(err);
  }
};

const getTransfers = async () => {
  try {
    const findData = await TransferData.find({});

    return findData;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { findAdmin, newAccount, getUsers, getTransfers };
