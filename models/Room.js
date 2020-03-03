const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: false
  },
  customers: [
    {
      type: Schema.Types.ObjectId,
      ref: "customers"
    }
  ],
  currentCustomer: {
    type: Schema.Types.ObjectId,
    ref: "customers"
  },
  finishedCustomers: [
    {
      type: Schema.Types.ObjectId,
      ref: "customers"
    }
  ]
});

module.exports = mongoose.model("rooms", RoomSchema);
