import express from 'express';

const router = express.Router();
import { protectRoute } from '../middleware/authMiddleware.js';
import {recommendedUsers, getFriendsList, sendFriendRequest, acceptFriendRequest, getFriendRequest, getOutgoingFriendRequest} from '../controller/userController.js';
router.use(protectRoute);
router.get('/', recommendedUsers);
router.get('/friends', getFriendsList);
router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.get('/friend-request', getFriendRequest);
router.get("/outgoing-friend-request", getOutgoingFriendRequest);


export default router;