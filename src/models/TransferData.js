const mongoose = require('./connection');

const TransferDataSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    // 'versionKey' removes the field "__v" which controls how many updates the document had
    versionKey: false,
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const TransferData = mongoose.model('TransferData', TransferDataSchema);

module.exports = TransferData;
