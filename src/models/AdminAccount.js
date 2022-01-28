const mongoose = require('./connection');

const crypto = require('crypto-js');

const AdminAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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

AdminAccountSchema.pre('save', async function (next) {
  const encryptedPass = await crypto.MD5(this.password);
  this.password = encryptedPass;

  next();
});

const AdminAccount = mongoose.model('AdminAccount', AdminAccountSchema);

module.exports = AdminAccount;
