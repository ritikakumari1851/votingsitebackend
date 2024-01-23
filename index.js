// index,js
const express = require('express');
const server = express();
const cors = require("cors");
const {Server} = require("socket.io")
const http = require("http")
const app = http.createServer(server)
const io = new Server(app)
server.use(express.json());
server.use(cors())

const mongoose = require('mongoose');
const { register, login, findUser } = require('./src/Controllers/auth');
const { verifyToken, validateForm, isValidated } = require('./src/Middleware');
const { addForm } = require('./src/Controllers/form');
const { sendEmail } = require('./src/helper/Email');


server.get("/", (req, res) => {
    res.status(200).json({
        uname: "Anshu",
        uphone: "0000000",
        username: "welcome Anshu"
    })
})
require('dotenv').config()
server.post("/register",register,sendEmail)
server.get("/get-user",verifyToken,findUser)
server.post("/login",login)
server.post("/addform",validateForm,isValidated,addForm,sendEmail)

io.on("connection",socket=>{
    console.log("new user connected")
    socket.on("message",(message,room)=>{
        console.log(`New message received in ${room} and message is ${message}`);

    socket.to(room).emit("message",message)
    
    })
    socket.on("join",(room)=>{
        console.log(room);
        socket.join(room)
        socket.emit("joined")
    })
    })
    socket.on("disconnect", (reason, details) => {
        // the reason of the disconnection, for example "transport error"
        console.log(reason);
      
        // the low-level reason of the disconnection, for example "xhr post error"
        console.log(details.message);
      
        // some additional description, for example the status code of the HTTP response
        console.log(details.description);
      
        // some additional context, for example the XMLHttpRequest object
        console.log(details.context);
      });

    const port = process.env.PORT || 4000;
mongoose.connect(
   process.env.MONGO_URL
)
    .then(() => console.log("Database is connected"))
    .catch(error => console.log(error.message));

server.listen(port, function () {
    console.log("Server is on");
});
