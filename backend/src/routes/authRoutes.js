import express from 'express';
import { logout, login, signup } from '../controller/authController.js';
const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);
router.post('/logout', logout);

export default router;