//auth.js
const user = require("../model/user");
const jwt = require("jsonwebtoken");
const voter = require("../model/voter");
const candidate = require("../model/candidate");
exports.register = async (req, res, next) => {
  const { full_name, email, password, username, Dob, gender } = req.body;
  const _user = new user({
    full_name: full_name,
    email: email,
    username: username,
    Dob: Dob,
    gender: gender,
    password,
  });
  const eUser = await user.findOne({ email });

  console.log(eUser);

  if (!eUser) {
    _user
      .save()
      .then(() => {
        // return res.status(201).json({newUser,message:"Sucessfully"})
        (req.subject = "User Registration"),
          (req.text = "You have sucessfully Registered to VoteOnclick.");

        next();
      })
      .catch((error) => {
        return res.status(400).json({
          message: "Error occurred",
          error,
        });
      });
  } else {
    return res.status(409).json({
      message: "User already exists",
    });
  }
};
exports.voteregister = async (req, res) => {
  const { full_name, email, username, Dob, gender, mobile_no, password } =
    req.body;
  const _voter = new voter({
    full_name: full_name,
    email: email,
    username: username,
    Dob: Dob,
    gender: gender,
    mobile_no: mobile_no,
    password,
  });
  const eVoter = await voter.findOne({ email });

  console.log(eVoter);

  if (!eVoter) {
    _voter
      .save()
      .then((newVoter) => {
        return res.status(201).json({ newVoter, message: "Sucessfully" });
        // (req.subject = "User Registration"),
        //   (req.text = "You have sucessfully Registered to VoteOnclick.");

        // next();
      })
      .catch((error) => {
        return res.status(400).json({
          message: "Error occurred",
          error,
        });
      });
  } else {
    return res.status(409).json({
      message: "User already exists",
    });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const eUser = await user.findOne({ email });
  if (eUser) {
    if (eUser.authenticate(password)) {
      const token = jwt.sign(
        {
          id: eUser._id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1y",
        }
      );
      res.status(200).json({ token, message: "Login Succesfull" });
    } else {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }
  } else {
    return res.status(404).json({
      message: "User not found",
    });
  }
};

exports.voterlogin = async (req, res) => {
  const { email, password } = req.body;
  const eVoter = await voter.findOne({ email });
  if (eVoter) {
    if (eVoter.authenticate(password)) {
      const token = jwt.sign(
        {
          id:eVoter._id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1y",
        }
      );
      res
        .status(200)
        .json({ token, voterId:eVoter._id, message: "Login Successful" });
    } else {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

exports.findUser = async (req, res) => {
  try {
    const user_ = await user.findById(req.id);

    if (!user_) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    console.log("Request received at /get-user");
    console.log("User data:", user_); // Assuming findUser sets user data in req.user

    // Send relevant user data, including the name
    const { _id, full_name, email, username, Dob, gender } = user_;
    return res.status(200).json({
      user: { _id, full_name, email, username, Dob, gender },
      message: "User data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
exports.vote = async (req, res) => {
  const { voterId, candidateId } = req.body;
  try {
    // Find the voter and candidate
    const voter = await voter.findById(voterId);
    const candidate = await candidate.findById(candidateId);

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
};
