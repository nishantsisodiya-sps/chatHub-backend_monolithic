const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupsController')

router.post('/Add-groups/:userId' , groupController.createGroup);
router.patch('/update-profile/:groupId' , groupController.updateGroupProfilePicture)
router.put('/update/:groupId' , groupController.updateGroup)
router.get("/:userId" , groupController.getGroupsForUser)
router.patch("/Admin/:groupId" , groupController.createAdmin)
router.patch("/RemoveAdmin/:groupId" , groupController.removeAdmin)

module.exports = router;