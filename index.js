// index,js
const express = require('express');
const server = express();
const {Server} = require("socket.io")
const http = require("http")
const app= http.createServer(server)
const io= new Server(app)
const port = process.env.PORT || 3000

const cors = require("cors");
const mongoose = require('mongoose');
const { register, login, findUser } = require('./src/Controllers/auth');
const { verifyToken, validateForm, isValidated } = require('./src/Middleware');
const { addForm } = require('./src/Controllers/form');
const { sendEmail } = require('./src/helper/Email');
server.use(express.json());
server.use(cors())
server.get("/", (req, res) => {
    res.status(200).json({
        uname: "Ritika",
        uphone: "0000000",
        username: "welcome Ritika"
    })
})

require('dotenv').config()
server.post("/register",register,sendEmail)
server.get("/get-user",verifyToken,findUser)
server.post("/login",login)
server.post("/addform",validateForm,isValidated,addForm,sendEmail)
io.on("connection",(socket)=>{
    console.log("new user connected")
    socket.on("message",(message,room)=>{
        console.log`(New message recieved in ${room} and message is ${message})`;
    socket.to(room).emit("message",message)
})
socket.on("join",(room)=>{
    socket.join(room)
    socket.emit("joined")
})
})
        
mongoose.connect(
   process.env.MONGO_URL
)
    .then(() => console.log("Database is connected"))
    .catch(error => console.log(error.message));

app.listen(port, function () {
    console.log("Server is on");
});
