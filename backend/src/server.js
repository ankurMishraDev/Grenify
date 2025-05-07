import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.get("/api/auth/signup", (req, res) => {
  res.send("/api/auth/Signup");
});
app.get("/api/auth/login", (req, res) => {
  res.send("/api/auth/Login");
});
app.get("/api/auth/logout", (req, res) => {
  res.send("Logout");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
