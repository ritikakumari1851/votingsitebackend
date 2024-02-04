const Candidate = require("../model/Candidate");
const multer = require("multer");
const express = require("express");
const router = express.Router();

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to handle file uploads
const uploadMiddleware = upload.single("profilePicture");

// Route to handle candidate registration
router.post("/candidate", uploadMiddleware, async (req, res) => {
  const { fullName, email, about, mobile_no, adhar_no, position } = req.body;

  // Check if a file is present in the request
  const profilePicture = req.file ? req.file.buffer.toString("base64") : null;

  const _candidate = new Candidate({
    fullName,
    email,
    about,
    mobile_no,
    adhar_no,
    position,
    profilePicture,
  });

  try {
    const existingCandidate = await Candidate.findOne({ email });

    if (!existingCandidate) {
      await _candidate.save();
      return res.status(201).json({ message: "Successfully registered" });
    } else {
      return res.status(409).json({ message: "Candidate already exists" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Route to get all candidates
exports.findcandidate = async (req, res) => {
    
  try {
    const candidate_ = await Candidate.findById(req.id);

    if (!candidate_) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    console.log("Request received at /get-user");
    console.log("User data:", candidate_); // Assuming findUser sets user data in req.user
    
    // Send relevant user data, including the name
    const { _id, full_name, email } = candidate_;
    return res.status(200).json({
      user: { _id, full_name, email },
      message: "User data retrieved successfully"
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
    
  }
  
};
