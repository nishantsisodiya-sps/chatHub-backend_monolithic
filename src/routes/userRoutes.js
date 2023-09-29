const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')


router.get('/:userId' , userController.getUserProfile)
router.put('/:userId' , userController.UpdateProfile);
router.delete('/:userId' , userController.deleteUser)
router.get('/' , userController.getAllUsers)
router.patch('/profile/:userId' , userController.uploadProfilePicture)

module.exports = router