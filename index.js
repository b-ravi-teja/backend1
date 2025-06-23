const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();
const JWT_SECRET = process.env.JWT;
const app = express();
app.use(express.json());
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Mongoose User Schema
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: String,
    password: String,
  })
);



app.get("/", (req, res) => {
  res.status(200).json({
    message: "server is working",
  });
});

app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password is too short or missing fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });
  const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET);

  res.json({
    user,
    token,
    message: "User created successfully",
  });
});

app.post("/api/auth/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(403).json({ message: "Incorrect password" });
  }

  const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET);

  res.json({ user,token });
});

 
app.post("/api/uploadtoIPFS", (req, res) => {
  // Placeholder for IPFS upload logic
  res.json({ message: "Upload route working" });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
