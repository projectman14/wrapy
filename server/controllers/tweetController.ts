import { Request, Response } from "express";
import * as TweetService from '../services/tweetService'

export const createPost = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { content, mediaUrl } = req.body;

    try {
        const tweet = await TweetService.createPost(user, content, mediaUrl);
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