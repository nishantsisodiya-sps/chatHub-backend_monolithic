const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");


router.post("/send" , messageController.sendMessage);
router.get("/get-message" , messageController.getMessages);
router.patch("/Update-status" , messageController.updateMessageStatus);



module.exports = router;


