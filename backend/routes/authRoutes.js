import express from 'express';
import { logout, login, signup } from '../controller/authController.js';
const router = express.Router();

router.get('/login', login);

router.get('/signup', signup);
router.get('/logout', logout);

export default router;