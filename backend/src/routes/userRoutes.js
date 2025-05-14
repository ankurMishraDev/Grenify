import express from 'express';

const router = express.Router();
import { protectRoute } from '../middleware/authMiddleware.js';
import {recommendedUsers, getFriendsList} from '../controller/userController.js';
router.use(protectRoute);
router.get('/', recommendedUsers);
router.get('/friends', getFriendsList);
export default router;