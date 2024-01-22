// index,js
const express = require('express');
const server = express();
const cors = require("cors");
const mongoose = require('mongoose');
const { register, login, findUser } = require('./src/Controllers/auth');
const { verifyToken, validateForm, isValidated } = require('./src/Middleware');
const { addForm } = require('./src/Controllers/form');
const { sendEmail } = require('./src/helper/Email');
server.use(express.json());
server.use(cors())
require('dotenv').config()
server.post("/register",register,sendEmail)
server.get("/get-user",verifyToken,findUser)
server.post("/login",login)
server.post("/addform",validateForm,isValidated,addForm,sendEmail)

mongoose.connect(
   process.env.MONGO_URL
)
    .then(() => console.log("Database is connected"))
    .catch(error => console.log(error.message));

server.listen(process.env.PORT, function () {
    console.log("Server is on");
});
