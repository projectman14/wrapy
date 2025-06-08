import { Request, Response } from "express";
import * as FollowService from "../services/followService";

export const follow = async (req: Request, res: Response) => {
    const follower = (req as any).user;
    const followingId = parseInt(req.params.id);

    try {
        const result = await FollowService.followUser(follower.id, followingId);
        res.status(201).json({ message: "Followed", result });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
};

export const unfollow = async (req: Request, res: Response) => {
    const follower = (req as any).user;
    const followingId = parseInt(req.params.id);

    try {
        const result = await FollowService.unfollowUser(follower.id, followingId);
        res.status(200).json({ message: "Unfollowed", result });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
};

export const getFollowers = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const followers = await FollowService.getFollowers(userId);
    res.json({ followers });
};

export const getFollowing = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const following = await FollowService.getFollowing(userId);
    res.json({ following });
};

export const checkIsFollowing = async (req: Request, res: Response) => {
    const followerId = parseInt(req.params.id);
    const followingId = parseInt(req.params.otherId);

    const result = await FollowService.isFollowing(followerId, followingId);
    res.json({ isFollowing: result });
};