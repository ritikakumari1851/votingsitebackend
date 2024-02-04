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
  adhar_no: {
    type: Number,
  },
  position: {
    type: String,
  },
  Image: { data: Buffer ,
    contentType: String},
});
module.exports = mongoose.model("candidate", candidateSchema);
