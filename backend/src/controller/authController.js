import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const checkPassword = await user.checkPassword(password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("jwt_token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ Success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function signup(req, res) {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const emailRegexExpression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegexExpression.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        profileImage: newUser.profilePic,
      });
      console.log(
        `Stream user created for name ${
          newUser.fullName
        } with id ${newUser._id.toString()}`
      );
    } catch (error) {
      console.log("Error in upsertStreamUser", error.message);
    }
    // Create user in stream as well
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("jwt_token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      user: newUser,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function logout(req, res) {
  res.clearCookie("jwt_token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "Please fill all the fields",
        messageFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body, isOnboarding: true },
      { new: true }
    );
    if (!updateUser) {
      return res.status(400).json({ message: "User not found" });
    }
try{
    await upsertStreamUser({
      id: updateUser._id.toString(),
      name: updateUser.fullName,
      image: updateUser.profilePic
    })
    console.log(`Stream user updated after onboarding for name ${updateUser.fullName}`);
  }
    catch(streamError){
      console.log("Error in updating upsertStreamUser", streamError.message);
    }
    res.status(200).json({ success: true, user: updateUser });
  } catch (error) {
    console.log("Error in onboarding controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

