const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({

  username: {
    type: String,
  },

  name: {
    type: String,
    require: true,
  },

  email: {
    type: String,
    validator: validator.isEmail,
    require: true,
  },

  bio: {
    type: String,
    default: "" 
   },

 profilePicture: {
    type: String, 
    default: "" 
   },

  phone: {
    type: String,
    require: true,
    validate: {
      validator: function (v) {
        return validator.isMobilePhone(v, ["en-IN"]);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },

  password: {
    type: String,
    require: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  isBlocked: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },

  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    }
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { id: this._id, role: this.role, email: this.email, name: this.name },
      process.env.JWT_SECRET1
    );
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model("User", UserSchema);
