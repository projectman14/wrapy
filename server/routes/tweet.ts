import express from 'express';
import { createPost, getFeed } from '../controllers/tweetController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router
    .post('/create', requireAuth, createPost)
    .get('/feed', requireAuth, getFeed)

export default router;