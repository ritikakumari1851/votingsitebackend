// index,js
const express = require("express");
const server = express();
const multer = require("multer");
const { Server } = require("socket.io");
const http = require("http");
const app = http.createServer(server);
const io = new Server(app);
const port = process.env.PORT || 3000;

const cors = require("cors");
const mongoose = require("mongoose");
const { register, login, findUser } = require("./src/Controllers/auth");
const { verifyToken, validateForm, isValidated } = require("./src/Middleware");
const { addForm } = require("./src/Controllers/form");
const { sendEmail } = require("./src/helper/Email");
const { candidate } = require("./src/Controllers/candidate");
server.use(express.json());
server.use(cors());
server.get("/", (req, res) => {
  res.status(200).json({
    uname: "Ritika",
    uphone: "0000000",
    username: "welcome Ritika",
  });
});

require("dotenv").config();
server.post("/register", register, sendEmail);
server.get("/get-user", verifyToken, findUser, (req, res) => {
  if (!req.user) {
    // If user data is not found, return an error response
    return res.status(404).json({ error: "User not found" });
  }

  console.log("Request received at /get-user");
  console.log("User data:", req.user);
  res.json({ user: req.user });
});
server.use("/uploads", express.static("uploads"));
server.post("/login", login);
server.post("/addform", validateForm, isValidated, addForm, sendEmail);
server.post("/candidate", candidate);
io.on("connection", (socket) => {
  console.log("new user connected");
  socket.on("message", (message, room) => {
    console.log`(New message recieved in ${room} and message is ${message})`;
    socket.to(room).emit("message", message);
  });
  socket.on("join", (room) => {
    socket.join(room);
    socket.emit("joined");
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database is connected"))
  .catch((error) => console.log(error.message));

app.listen(port, function () {
  console.log("Server is on");
});
