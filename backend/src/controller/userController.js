import User from "../models/User.js";
import FriendRequest from "../models/Friend-Request.js";

export async function recommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    
    // Get all pending outgoing requests to exclude them from recommendations
    const outgoingRequests = await FriendRequest.find({
      sender: currentUserId,
      status: "pending"
    }).select("recipient");
    
    const outgoingRequestIds = outgoingRequests.map(req => req.recipient.toString());
    
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { _id: { $nin: outgoingRequestIds } }, // Exclude users with pending requests
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
        const user = await User.findById(req.user._id)
          .select("friends")
          .populate("friends", "fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(user.friends);
    }catch(error){
        console.log("Error in getFriendsList controller", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function sendFriendRequest(req, res){
    try{
        const thisId = req.user.id;
        const {id: recipientId} = req.params;

        console.log("Sender ID:", thisId);
        console.log("Recipient ID:", recipientId);

        if(thisId === recipientId){
            return res.status(400).json({message: "You cannot send a friend request to yourself"});
        }

        // Check if recipient exists
        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(400).json({message: "User not found"});
        }

        // Get current user
        const currentUser = await User.findById(thisId);
        if(!currentUser){
            return res.status(400).json({message: "Current user not found"});
        }

        // Check if they are already friends
        if(currentUser.friends.includes(recipientId)){
            return res.status(400).json({message: "You are already friends with this user"});
        }

        // Check for existing requests (in both directions)
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender: thisId, recipient: recipientId},
                {sender: recipientId, recipient: thisId}
            ],
            status: "pending"
        });

        if(existingRequest){
            if(existingRequest.sender.toString() === thisId){
                return res.status(400).json({message: "Friend request already sent"});
            } else {
                return res.status(400).json({message: "This user has already sent you a friend request"});
            }
        }

        // Create new friend request
        const friendRequest = await FriendRequest.create({
            sender: thisId, 
            recipient: recipientId,
            status: "pending"
        });

        console.log("Friend request created:", friendRequest);
        res.status(200).json({friendRequest});
    }catch(error){
        console.log("Error in sendFriendRequest controller", error.message);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export async function acceptFriendRequest(req, res){
    try{
        const {id: requestId} = req.params;
        const friendReqs = await FriendRequest.findById(requestId);
        
        if(!friendReqs){
            return res.status(400).json({message: "Friend request not found"});
        }
        
        if(friendReqs.recipient.toString() !== req.user.id){
            return res.status(400).json({message: "Unauthorized: You are not the recipient"});
        }
        
        if(friendReqs.status !== "pending"){
            return res.status(400).json({message: "Friend request already processed"});
        }

        // Update the request status
        friendReqs.status = "accepted";
        await friendReqs.save();
        
        // Add each user to the other's friend list
        await User.findByIdAndUpdate(friendReqs.sender, {
            $addToSet: {friends: friendReqs.recipient}
        });
        await User.findByIdAndUpdate(friendReqs.recipient, {
            $addToSet: {friends: friendReqs.sender}
        });
        
        res.status(200).json({message: "Friend request accepted successfully"});
    } catch(error){
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function getFriendRequest(req, res){
    try{
        // Clean up orphaned requests before fetching
        await cleanupOrphanedRequestsInternal();
        
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id, 
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");
        
        const acceptingReqs = await FriendRequest.find({
            sender: req.user.id, 
            status: "accepted"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
        
        // Filter out requests with null populated fields
        const validIncomingReqs = incomingReqs.filter(req => req.sender !== null);
        const validAcceptingReqs = acceptingReqs.filter(req => req.recipient !== null);
        
        res.status(200).json({
            incomingReqs: validIncomingReqs, 
            acceptingReqs: validAcceptingReqs
        });
    } catch(error){
        console.log("Error in getFriendRequest controller", error.message);
        res.status(500).json({
            message: "Internal server error",
        }); 
    }
}

export async function getOutgoingFriendRequest(req, res){
    try{
        // Clean up orphaned requests before fetching
        await cleanupOrphanedRequestsInternal();
        
        const outgoingReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
        
        // Filter out requests where recipient is null (deleted users)
        const validOutgoingReqs = outgoingReqs.filter(req => req.recipient !== null);
        
        console.log("Outgoing requests found:", validOutgoingReqs.length);
        res.status(200).json(validOutgoingReqs);
    } catch(error){
        console.log("Error in getOutgoingFriendRequest controller", error.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}

// Internal helper function for automatic cleanup
async function cleanupOrphanedRequestsInternal() {
    try {
        // Find all friend requests
        const allRequests = await FriendRequest.find({});
        const orphanedRequestIds = [];
        
        for (const request of allRequests) {
            // Check if sender exists
            const senderExists = await User.findById(request.sender);
            // Check if recipient exists
            const recipientExists = await User.findById(request.recipient);
            
            if (!senderExists || !recipientExists) {
                orphanedRequestIds.push(request._id);
            }
        }
        
        if (orphanedRequestIds.length > 0) {
            await FriendRequest.deleteMany({
                _id: { $in: orphanedRequestIds }
            });
            console.log(`Auto-cleaned ${orphanedRequestIds.length} orphaned friend requests`);
        }
    } catch (error) {
        console.log("Error in auto-cleanup:", error.message);
    }
}

// Public cleanup function for manual use
export async function cleanupOrphanedRequests(req, res) {
    try {
        await cleanupOrphanedRequestsInternal();
        
        // Get count of remaining requests for confirmation
        const remainingCount = await FriendRequest.countDocuments();
        
        res.status(200).json({ 
            message: "Cleanup completed successfully",
            remainingRequests: remainingCount
        });
    } catch (error) {
        console.log("Error in cleanupOrphanedRequests", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}