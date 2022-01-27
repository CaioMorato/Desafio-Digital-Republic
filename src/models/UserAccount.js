const mongoose = require('./connection');

const UserAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cpf: {
      type: Number,
      required: true,
      unique: true,
    },
    saldo: {
      type: Number,
      default: 10000,
    },
  },
  {
    // 'versionKey' removes the field "__v" which controls how many updates the document had
    versionKey: false,
    timestamps: {
      createdAt: false,
      updatedAt: false,
    },
  }
);

const UserAccount = mongoose.model('UserAccount', UserAccountSchema);

module.exports = UserAccount;
