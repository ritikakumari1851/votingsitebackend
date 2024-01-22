// user.js
const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        require: true
    },
    email:{
        type: String,
        require:true
    },
    username: {
        type: String,
        require: true
    },
    Dob:{
        type: Date,
        required:true
    },
    gender:{
        type: String,
       
    },
    hash_password:{
        type:String,
        required:true
    },
});
userSchema.virtual("password").set(function(password) {
    if (!password) {
        return;
    }
    this.hash_password = bcrypt.hashSync(password, 10);
});

userSchema.methods= {
    authenticate : function (password){
        return bcrypt.compareSync(password,this.hash_password)
    }
}
module.exports = mongoose.model('User', userSchema)
