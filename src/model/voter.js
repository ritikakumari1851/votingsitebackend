// voter.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const voterSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  Dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
  },
  mobile_no: {
    type: Number,
  },
  hash_password: {
    type: String,
    required: true,
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
});

voterSchema.virtual("password").set(function (password) {
  if (!password) {
    return;
  }
  this.hash_password = bcrypt.hashSync(password, 10);
});

voterSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compareSync(password, this.hash_password);
  },
};

module.exports = mongoose.model("Voter", voterSchema);
