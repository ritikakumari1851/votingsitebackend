const express = require("express");
const server = express();
const { Server } = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  register,
  login,
  findUser,
  voteregister,
  voterlogin,
  vote,
} = require("./src/Controllers/auth");
const {
  verifyToken,
  validateForm,
  isValidated,
  uploadMiddleware,
} = require("./src/Middleware");
const { addForm } = require("./src/Controllers/form");
const { sendEmail } = require("./src/helper/Email");
const Candidate = require("./src/model/candidate");
const voter = require("./src/model/voter");
const voter = require("./src/model/voter");
server.use(express.json());
server.use(cors());

const app = http.createServer(server);
const io = new Server(app);

const port = process.env.PORT || 3000;

server.get("/", (req, res) => {
  res.status(200).json({
    uname: "Ritika",
    uphone: "0000000",
    username: "welcome Ritika",
  });
});

require("dotenv").config();
server.post("/register", register, sendEmail);
server.post("/voteregister", voteregister);
server.post("/voterlogin", voterlogin);
server.get("/get-user", verifyToken, findUser, (req, res) => {
  if (!req.user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user: req.user });
});
server.post("/candidate", async (req, res) => {
  try {
    const {
      full_name,
      Name,
      email,
      mobile_no,
      position,
      dob,
      about,
      message,
      BallotId,
    } = req.body;
    const newCandidate = new Candidate({
      full_name,
      Name,
      email,
      mobile_no,
      position,
      dob,
      about,
      message,
      BallotId,
    });
    await newCandidate.save();
    res.send("Data inserted");
  } catch (error) {
    console.error("Error inserting data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
server.get("/candidate", async (req, res) => {
  try {
    let { BallotId } = req.query;
    BallotId = BallotId.toLowerCase(); // Convert to lowercase for case-insensitive matching
    const candidates = await Candidate.find({ BallotId });
    res.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
server.post("/login", login);
server.post("/addform", validateForm, isValidated, addForm, sendEmail);
server.post("/vote", async (req, res) => {
  const { voterId, candidateId } = req.body;

  try {
    // Find the voter and candidate
    const voter = await voter.findById(voterId);
    const candidate = await Candidate.findById(candidateId);

    // Check if voter and candidate exist
    if (!voter || !candidate) {
      return res.status(404).json({ message: "Voter or candidate not found" });
    }

    // Check if the voter has already voted
    if (voter.hasVoted) {
      return res.status(400).json({ message: "Voter has already voted" });
    }

    // Increment the candidate's vote count
    candidate.voteCount += 1;
    await candidate.save();

    // Update voter's status to indicate they have voted
    voter.hasVoted = true;
    await voter.save();

    return res.status(200).json({ message: "Vote submitted successfully" });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


io.on("connection", (socket) => {
  console.log("New user connected");
  socket.on("message", (message, room) => {
    console.log(`New message received in ${room} and message is ${message}`);
    socket.to(room).emit("message", message);
  });
  socket.on("join", (room) => {
    socket.join(room);
    socket.emit("joined");
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
