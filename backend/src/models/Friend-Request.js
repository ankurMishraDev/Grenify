import mongoose  from "mongoose";


const friendReqSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type: mongoose.Schema.Types.String,
        enum: ['pending', 'accepted'],
        default: 'pending'
    }
},{timestamps: true});

const FriendRequest = mongoose.model('FriendRequest', friendReqSchema);
export default FriendRequest;