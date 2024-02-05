const Candidate = require("../model/Candidate");


// Route to handle candidate registration
exports.candidate = async (req, res) => {
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
};

// Route to get all candidates