const express = require("express");
const server = express();
const { Server } = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const Axios = require("axios")
const {
  register,
  login,
  findUser,
  voteregister,
  voterlogin,
  vote,
} = require("./src/Controllers/auth");
const { verifyToken, validateForm, isValidated } = require("./src/Middleware");
const { addForm } = require("./src/Controllers/form");
const { sendEmail } = require("./src/helper/Email");
const Candidate = require("./src/model/candidate");
const Vote = require("./src/model/vote")
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
server.delete("/candidate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidate:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
server.post("/login", login);
server.post("/addform", validateForm, isValidated, addForm, sendEmail);
server.post("/vote", vote);
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
// Define route to handle fetching candidate information and total votes for a given ballot ID
server.get('/result/:ballotId', async (req, res) => {
  try {
    const { ballotId } = req.params;

    // Get all candidates for the given ballotId
    const allCandidates = await Candidate.find({ BallotId: ballotId });

    // Create an array to store the result with default vote count of 0 for all candidates
    const result = allCandidates.map(candidate => ({
      _id: candidate._id,
      totalVotes: 0
    }));

    // Query the database to aggregate total votes for each candidate associated with the provided ballot ID
    const votes = await Vote.aggregate([
      {
        $match: { ballotId: mongoose.Types.ObjectId(ballotId) }
      },
      {
        $group: {
          _id: "$candidateId",
          totalVotes: { $sum: 1 }
        }
      }
    ]);

    // Update the result array with actual vote counts
    votes.forEach(vote => {
      const candidateIndex = result.findIndex(candidate => candidate._id.equals(vote._id));
      if (candidateIndex !== -1) {
        result[candidateIndex].totalVotes = vote.totalVotes;
      }
    });

    // Return the result
    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching result:", error);

    // Check for specific types of errors
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid Ballot ID" });
    }

    // Add more specific error handling as needed...

    return res.status(500).json({ message: "Internal Server Error" });
  }
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
