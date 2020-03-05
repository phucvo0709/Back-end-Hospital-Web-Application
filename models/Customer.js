const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CustomerSchema = Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  historyInRooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "rooms"
    }
  ]
});

module.exports = mongoose.model("customers", CustomerSchema);
