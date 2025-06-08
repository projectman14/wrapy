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

export const getFeed = async (req: Request, res: Response) => {
    const user = (req as any).user;
    try {
        const tweets = await TweetService.getFeed(user);
        res.status(200).json(tweets);
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
}

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