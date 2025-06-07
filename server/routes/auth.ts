import express from 'express';
import { registerUser , loginUser, verifyEmail } from '../controllers/authController';

const router = express.Router();

router  
    .post('/register' , registerUser)
    .post('/login' , loginUser)
    .post('/mail_verify' , verifyEmail)

export default router;