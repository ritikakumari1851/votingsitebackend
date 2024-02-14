// candidate.js
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  full_name: {
    type: String,
   
  },
  Name: {
    type: String,
  },
  email: {
    type: String,
  },
  about: {
    type: String,
  },
  mobile_no: {
    type: Number,
  },
  position: {
    type: String,
  },
  dob: {
    type: Date,
  },
  message: {
    type: String,
  },
  BallotId: {
    type: Number,
  },
  voteCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Candidate", candidateSchema);
