const mongoose = require('mongoose');
const validator = require("validator");


const groupSchema = mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  description: String,
  members: [
    {
      type: String, 
      required: true,
    },
  ],
  profilePicture: String, 
 
  createdBy: String,

  admin : [
    {
        type : String,
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('Groups' , groupSchema)


