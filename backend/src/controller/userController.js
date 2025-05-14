import User from "../models/User.js";

export async function recommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { $id: { $nin: currentUser.friends } },
        { isOnboarding: true },
      ],
    });
    res.status(200).json({ recommendedUsers });
  } catch (error) {
    console.log("Error in recommendedUsers controller", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getFriendsList(req, res){
    try{
        const user = await User.findById(req.user._id).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage ");
        res.status(200).json(user.friends);
    }catch(error){
        console.log("Error in getFriendsList controller", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}
