import { Request, Response } from "express";
import * as TweetService from '../services/tweetService'

export const createPost = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { content, mediaUrl, parentId, threadRootId, quoteOfId } = req.body;

    try {
        const tweet = await TweetService.createPost(user, content, mediaUrl, parentId, threadRootId, quoteOfId);
        res.status(201).json({ tweet })
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
}

export const createTweetWithMedia = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { content, parentId, threadRootId, quoteOfId } = req.body;
        const file = req.file;

        const mediaUrl = file?.path || null;

        const tweet = await TweetService.createTweetWithMediaService(user.id, content, mediaUrl, parentId, threadRootId, quoteOfId);

        res.status(201).json(tweet);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
};


export const getFeed = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { cursor } = req.query;
    try {
        const feed = await TweetService.getFeed(user, 20, cursor ? Number(cursor) : undefined);
        res.status(200).json(feed);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
}

export const getExploreFeed = async (req: Request, res: Response) => {
    const { cursor } = req.query;

    try {
        const feed = await TweetService.getExploreFeed(20, cursor ? Number(cursor) : undefined);
        res.status(200).json(feed);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
};


export const likeTweet = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const tweetId = parseInt(req.params.tweetId);
    try {
        const { like, tweet } = await TweetService.likeTweet(user, tweetId);
        res.status(201).json({ like, tweet });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
}

export const unlikeTweet = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const tweetId = parseInt(req.params.tweetId);
    try {
        await TweetService.unlikeTweet(user, tweetId);
        res.status(200).json({ message: 'Unliked' });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
}

export const getReplies = async (req: Request, res: Response) => {
    const tweetId = parseInt(req.params.id);
    try {
        const replies = await TweetService.getRepliesForTweet(tweetId);
        res.status(200).json({ replies });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
};

export const getThread = async (req: Request, res: Response) => {
    const tweetId = parseInt(req.params.id);

    try {
        const thread = await TweetService.getThread(tweetId);
        res.status(200).json({ thread });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
};

export const getQuotes = async (req: Request, res: Response) => {
    const tweetId = parseInt(req.params.id);

    try {
        const quotes = await TweetService.getQuoteTweets(tweetId);
        res.status(200).json({ quotes });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
};

export const addBookmark = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const tweetId = parseInt(req.params.id);

    try {
        const bookmark = await TweetService.addBookmark(user.id, tweetId);
        res.status(201).json({ message: "Tweet bookmarked", bookmark });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
};

export const removeBookmark = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const tweetId = parseInt(req.params.id);

    try {
        await TweetService.removeBookmark(user.id, tweetId);
        res.status(200).json({ message: "Bookmark removed" });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
};

export const listBookmark = async (req: Request, res: Response) => {
    const user = (req as any).user;

    try {
        const bookmarks = await TweetService.getBookmarks(user.id);
        res.status(200).json({ bookmarks });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
};
