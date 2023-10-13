const Group = require('../models/group')
const Users = require('../models/userModel')
const { uploadGroupProfilePic } = require('../utils/upload')
const singleGroupProfilePictureUpload =
  uploadGroupProfilePic.single('profilePicture')
//==========================>>>>>>>>> TO CREATE A NEW GROUP <<<<<<<<<<===============================

exports.createGroup = async (req, res) => {
  try {
    console.log(req.params)
    const { name, members, description } = req.body
    const createdBy = req.params.userId

    const isuser = await Users.findById(createdBy)
    if (!isuser) {
      res.status(404).json({ msg: 'No user Found' })
    }
    members.push(createdBy)
    const newGroup = new Group({ name, members, description, createdBy })
    newGroup.admin.push(createdBy)
    await newGroup.save()
    res.status(201).json({ msg: 'Group created Successfully' })
  } catch (error) {
    console.error('Error creating group', error.message)
    res.status(500).json({ error: 'Error creating group' })
  }
}

//=========================>>>>>>>>> TO UPDATE GROUP PROFILE PICTURE <<<<<<<<<<===========================

exports.updateGroupProfilePicture = async (req, res) => {
  try {
    const groupId = req.params.groupId

    // Find the group by ID
    const group = await Group.findById(groupId)

    if (!group) {
      return res.status(404).json({ error: 'Group not found.' })
    }

    // Upload the new group profile picture
    singleGroupProfilePictureUpload(req, res, async err => {
      if (err) {
        console.error('Error uploading group profile picture:', err)
        return res
          .status(500)
          .json({ error: 'Error uploading group profile picture' })
      }

      if (req.file) {
        group.profilePicture = req.file.location
      }

      // Save the updated group
      await group.save()

      res
        .status(200)
        .json({ message: 'Group profile picture uploaded successfully' })
    })
  } catch (error) {
    console.error('Error updating group profile picture', error.message)
    res.status(500).json({ error: 'Error updating group profile picture' })
  }
}

//=============================>>>>>>>>> TO UPDATE GROUP NAME <<<<<<<<<<===============================

exports.updateGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { name, members, description } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    if (name !== undefined) {
      group.name = name;
    }

    if (description !== undefined) {
      group.description = description;
    }

    if (members !== undefined) {
      if (Array.isArray(members)) {
        const membersToAdd = [];
        const membersAlreadyPresent = [];

        for (const member of members) {
          if (!group.members.includes(member)) {
            membersToAdd.push(member);
          } else {
            membersAlreadyPresent.push(member);
          }
        }

        if (membersToAdd.length > 0) {
          group.members = group.members.concat(membersToAdd);
        }

        let responseMsg = 'Members added to the group';
        if (membersAlreadyPresent.length > 0) {
          responseMsg += ` and members with the following user IDs are already present: ${membersAlreadyPresent.join(', ')}`;
        }

        await group.save(); 

        return res.status(200).json({ msg: responseMsg });
      } else if (!group.members.includes(members)) {
        group.members.push(members);
        await group.save(); 
        return res.status(200).json({ msg: 'Member added to the group' });
      } else {
        return res.status(200).json({ msg: 'Member is already in the group' });
      }
    }

    await group.save(); 

    res.status(200).json(group);
  } catch (error) {
    console.error('Error updating group', error.message);
    res.status(500).json({ error: 'Error updating group' });
  }
};





//==========================>>>>>>>>> TO GET THE GROUPS OF A USER <<<<<<<<<<=============================

exports.getGroupsForUser = async (req, res) => {
  try {
    const userId = req.params.userId

    // Find groups where the user is a member
    const groups = await Group.find({ members: userId })

    res.status(200).json(groups)
  } catch (error) {
    console.error('Error fetching groups for user', error.message)
    res.status(500).json({ error: 'Error fetching groups for user' })
  }
}

//==========================>>>>>>>>> TO Create Admin in a Group <<<<<<<<<<=============================

exports.createAdmin = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.body.userId;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ msg: 'Group Not Found' });
    }

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User Not Found' });
    }

    if (!group.members.includes(userId)) {
      return res.status(400).json({ msg: 'User is not a member of the group' });
    }

    if (group.admin.includes(userId)) {
      return res.status(400).json({ msg: 'User is already an admin of the group' });
    }

    group.admin.push(userId);
    await group.save();

    res.status(201).json({ msg: 'Admin created successfully' });
  } catch (error) {
    console.error('Error Creating Admin', error.message);
    res.status(500).json({ error: 'Error while creating Admin' });
  }
};

//==========================>>>>>>>>> TO Remove Admin from the Group <<<<<<<<<<=============================

exports.removeAdmin = async (req, res) => {
  try {
  
    const groupId = req.params.groupId;
    const {userId} = req.body;
   
    const group = await Group.findById(groupId);
   

    if (!group) {
      return res.status(404).json({ msg: 'Group Not Found' });
    }
   
    const indexOfUser = group.admin.indexOf(userId);

    if (indexOfUser === -1) {
      return res.status(404).json({ msg: 'User is not an admin of the group' });
    }

    group.admin.splice(indexOfUser, 1);
    await group.save();

    res.status(200).json({ msg: 'Admin Removed Successfully' });
  } catch (error) {
    console.error('Error while Removing Admin', error.message);
    res.status(500).json({ error: 'Error While Removing Admin' });
  }
};