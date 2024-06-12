const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../models/User");

// configuration Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // store uploaded files in the "upload" folders
  },
  filename: function (req, file, cb) {
    cd(null, file.originalname);
  }, // use the original file name
});

// USER REGISTER

router.post("/register", Upload.single("profileImage"), async (req, res) => {
  try {
    // take all information from the form
    const { firstName, lastName, email, password } = req.body;

    //  the uploaded file is avaliable as req.file
    const profileImage = req.file;
    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    /* path to the uploaded profile photo */
    const profileImagePath = profileImage.path;

    const existingUser = await User.findOne({
      email: email,
    });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hass the Password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    // Create a new User
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedpassword,
      profileImage: profileImagePath,
    });

    // Save the new User
    await newUser.save();

    // send a successfull message
    res.status(200).json({
      message: "User Register Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
});
