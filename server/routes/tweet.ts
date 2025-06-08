import express from 'express';
import { createPost, getFeed, getQuotes, getReplies, getThread, likeTweet, unlikeTweet } from '../controllers/tweetController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router
    .post('/create', requireAuth, createPost)
    .post('/like/:tweetId', requireAuth , likeTweet)
    .post('/unlike/:tweetId' , requireAuth , unlikeTweet)
    .get('/feed', requireAuth, getFeed)
    .get('/:id/replies', getReplies)
    .get('/:id/thread', getThread)
    .get('/:id/quotes', getQuotes)

export default router;