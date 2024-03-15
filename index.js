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
  voters,
  Candidate,
  vote,
} = require("./src/Controllers/auth");
const { verifyToken, validateForm, isValidated } = require("./src/Middleware");
const { addForm } = require("./src/Controllers/form");
const { sendEmail } = require("./src/helper/Email");
const Vote = require("./src/model/vote");
const candidate = require("./src/model/candidate");
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
server.post("/login", login);
server.get("/get-user", verifyToken, findUser, (req, res) => {
  if (!req.user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user: req.user });
});
server.post("/vote", vote);
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
    const newCandidate = new candidate({
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

// Define route to handle fetching candidate information and total votes for a given ballot ID
server.get("/result/:ballotId", async (req, res) => {
  try {
    const { ballotId } = req.params;

    // Aggregate total votes for each candidate associated with the provided ballot ID
    const result = await Vote.aggregate([
      { $match: { ballotId: parseInt(ballotId) } }, // Convert ballotId to integer
      { $group: { _id: "$candidateId", totalVotes: { $sum: 1 } } },
    ]);

    // Fetch candidate details for each candidate
    const candidates = await candidate.find({ BallotId: ballotId });

    // Map each candidate to include total votes
    const candidateResults = candidates.map((candidate) => {
      const candidateVotes = result.find(
        (vote) => vote._id.toString() === candidate._id.toString()
      );
      const totalVotes = candidateVotes ? candidateVotes.totalVotes : 0;
      return {
        _id: candidate._id,
        name: candidate.full_name,
        totalVotes,
      };
    });

    // Return the result
    return res.status(200).json({ candidate: candidateResults });
  } catch (error) {
    console.error("Error fetching result:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
server.delete("/candidate/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await candidate.delete({ _id: id });
    if (result.deletedCount === 1) {
      res.json({ message: "Candidate deleted successfully" });
    } else {
      res.status(404).json({ error: "Candidate not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define route to handle fetching candidate information and total votes for a given ballot ID
server.get("/voters", voters);
server.get("/candidate", Candidate);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
