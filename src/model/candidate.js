const mongoose = require("mongoose");
const candidateSchema = new mongoose.Schema({
  full_Name: {
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
    type:Date
  },
  message:{
    type:String
  },
  BallotID:{
    type:Number
  },
  vote: { type: Number, default: 0 }
});
module.exports = mongoose.model("candidate", candidateSchema);
