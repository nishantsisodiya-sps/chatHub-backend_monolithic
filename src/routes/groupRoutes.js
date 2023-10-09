const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupsController')

router.post('/Add-groups' , groupController.createGroup);