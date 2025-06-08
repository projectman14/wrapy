import express from 'express';
import { createPost, getFeed, getQuotes, getReplies, getThread, likeTweet, unlikeTweet, addBookmark, removeBookmark, listBookmark, getExploreFeed, createTweetWithMedia } from '../controllers/tweetController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router
    .post('/create', requireAuth, createPost)
    .post('/createWithMedia', requireAuth, createTweetWithMedia)
    .post('/like/:tweetId', requireAuth, likeTweet)
    .post('/unlike/:tweetId', requireAuth, unlikeTweet)
    .get('/feed', requireAuth, getFeed)
    .get('/:id/replies', getReplies)
    .get('/:id/thread', getThread)
    .get('/:id/quotes', getQuotes)
    .post("bookmark/:id", requireAuth, addBookmark)
    .delete("bookmark/:id", requireAuth, removeBookmark)
    .get("/bookmark", requireAuth, listBookmark)
    .get('/explore', getExploreFeed);

export default router;