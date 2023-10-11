const User = require("../models/userModel");
const {upload} = require("../utils/upload");
const singleProfilePictureUpload = upload.single('profilePicture');

//=============================>>>>>>>>> GET USER PROFILE <<<<<<<<<<=====================================

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ msg: "User not found" });
    }

    const userProfile = {
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      Bio: user.bio,
      profilePicture: user.profilePicture,
      name: user.name,
      createdAt: user.createdAt,
    };
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching user profile" });
  }
};

//=============================>>>>>>>>> GET All USERS <<<<<<<<<<=====================================

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password -tokens -__v");
    res.status(201).json({ users });
  } catch (error) {
    res.status(500).json({ msg: "Unable to fetch users" });
    console.log(error);
  }
};

//=============================>>>>>>>>> Update USER profile <<<<<<<<<<=================================

exports.UpdateProfile = async (req, res) => {
  try {

    const userId = req.params.userId;

    const updates = req.body

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.name = updates.name || user.name;
    user.email = updates.email || user.email;
    user.bio = updates.bio || user.bio;

    await user.save();

    const updatedProfile = new User({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      bio: user.bio
    });

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: "Error updating user profile." });
    console.log(error);
  }
};

//=============================>>>>>>>>> Update USER profile <<<<<<<<<<=================================

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params.userId;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User profile deleted successfully." });
  } catch (error) {
    res.status(500).json({msg : "Error while deleting user"})
    console.log(error);
  }
};




//============================>>>>>>>>> User Profile pic Upload <<<<<<<<<<=================================


exports.uploadProfilePicture = async (req, res) => {
  const userId = req.params.userId;
 

  try {
    // Upload the profile picture
    singleProfilePictureUpload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading profile picture:', err);
        return res.status(500).json({ error: 'Error uploading profile picture' });
      }
  
      const user = await User.findById(userId);
   

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
     
      // Update the profile picture field in the user document
      user.profilePicture = req.file.location;
      await user.save();

      res.status(200).json({ message: 'Profile picture uploaded successfully' }); 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile picture.' });
  }
};