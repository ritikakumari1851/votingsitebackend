const mongoose = require("mongoose")
const formSchema = new mongoose.Schema({
    Name:{
        type : String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    mobile_no:{
        type: Number,
        required: true
       
    },
    intrest:{
        type:String,
        required:true
       
    },


});
module.exports = mongoose.model('form', formSchema)