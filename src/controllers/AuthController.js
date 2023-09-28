const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

//<<<<<<<======================  HANDLE USER REGISTER API ================>>>>>>>>

exports.register = async function (req, res) {
  try {
    const { email, name, password, phone } = req.body;

    //Check if user already exists
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res
        .status(401)
        .json({ message: "User with this email already exists" });
    }

    // create a new user
    const newUser = new User({
      name,
      email,
      password,
      phone,
      tokens: [],
    });

    await newUser.save();

    //Generating Auth token
    const authToken = await newUser.generateAuthToken();

    return res.status(201).json({
      message: "User registered successfully",
      token: authToken,
      success: true,
    });
  } catch (error) {
    res.status(501).json({ msg: "Internal server error" });
    console.log(error);
  }
};


//<<<<<<<======================  HANDLE USER Login API ================>>>>>>>>

exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Check if either email or phone is provided
    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: "Email or phone number is required for login" });
    }

    let user;

    // Find the user based on email or phone
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid email or phone number" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const authToken = await user.generateAuthToken();
    return res
      .status(200)
      .json({ message: "Login successful", token: authToken, success: true });
  } catch (error) {
    console.log("User Login error ===>", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
