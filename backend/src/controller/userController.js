import User from "../models/User.js";
import FriendRequest from "../models/Friend-Request.js";

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

export async function sendFriendRequest(res, req){
    try{
        const thisId = req.user.id;
        const {id:recipientId} = req.params;

        if(thisId === recipientId){
            return res.status(400).json({message: "You cannot send a friend request to yourself"});
        }
        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(400).json({message: "Recipient not found"});
        }
        if(recipient.friends.includes(thisId)){
            return res.status(400).json({message: "You are already friend of this user"});
        }
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender: thisId, recipient: recipientId},
                {sender: recipientId, recipient: thisId}
            ]
        })
        if(existingRequest){
            return res.status(400).json({message: "Friend request already sent"});
        }
        const friendRequest = await FriendRequest.create({
            sender: thisId, 
            recipient: recipientId
        })
        res.status(200).json({friendRequest});
    }catch(error){
        console.log("Error in sendFriendRequest controller", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function acceptFriendRequest(req, res){
    try{
        const {id:requestId} = req.params;
        const friendReqs = await FriendRequest.findById(requestId)
        if(!friendReqs){
            return res.status(400).json({message: "Friend request not found"});
        }
        if(friendReqs.recipient.toString() !== req.user.id){
            return res.status(400).json({message: "You are not the recipient of this friend request"});
        }
        friendReqs.status = "accepted";
        await friendReqs.save();
        await User.findByIdAndUpdate(friendReqs.sender, {$addToSet: {friends: friendReqs.recipient}});
    } catch(error){
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function getFriendRequest(req, res){
    try{
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id, 
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage")
        const acceptingReqs = await FriendRequest.find({
            sender: req.user.id, 
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage")
        res.status(200).json({incomingReqs, acceptingReqs});
    } catch(error){
        console.log("Error in getFriendRequest controller", error.message);
        res.status(500).json({
            message: "Internal server error",
        }); 
    }
}

export async function getOutgoingFriendRequest(req, res){
    try{
        const outgoingReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage");
        res.status(200).json(outgoingReqs);
    } catch(error){
        console.log("Error in getOutgoingFriendRequest controller", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}