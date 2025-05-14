import express from 'express';
import { logout, login, signup, onboard } from '../controller/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);
router.post('/logout', logout);

router.post('/onboarding', protectRoute, onboard);

// sample route to check if the user is logged in
router.get("/me", protectRoute, async (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user,
    });
});
export default router;