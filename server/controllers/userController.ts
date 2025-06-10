import { Request, Response } from "express";
import * as userServices from '../services/userService'

export const getProfileStats = async (req: Request, res: Response) => {
    const { username } = req.params;
    try {
        const profile = await userServices.getUserProfileStats(username);
        res.status(200).json(profile);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const bio = req.body.bio;
    const file = req?.file;

    let avatarUrl = undefined;

    if (file) {
        avatarUrl = file.path;
    }

    try {
        const updatedUser = await userServices.updateProfile(user.id, bio, avatarUrl);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to update profile" });
    }
};
