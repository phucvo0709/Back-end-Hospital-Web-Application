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
  }
});

module.exports = mongoose.model("customers", CustomerSchema);