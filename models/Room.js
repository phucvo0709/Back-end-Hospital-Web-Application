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
  customer: {
    type: Schema.Types.ObjectId,
    ref: "customers"
  }
});

module.exports = mongoose.model("rooms", RoomSchema);
