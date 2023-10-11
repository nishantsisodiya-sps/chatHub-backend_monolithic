//Basic Requirements
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// express uses
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Middleware cors
app.use(cors());

//Routes imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes")

//Routes
app.use("/auth", authRoutes);
app.use('/users' , userRoutes);
app.use('/groups' , groupRoutes)

//Mongo connection
mongoose
  .connect(process.env.MONGO_URI1, {})
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error(err);
  });

// server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
