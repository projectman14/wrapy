import { Request, Response } from 'express';
import * as SearchService from '../services/searchService';

export const searchSystem = async (req: Request, res: Response) => {
    const query = req.query.q as string;

    try {
        const [tweets, users] = await Promise.all([
            SearchService.searchTweets(query),
            SearchService.searchUsers(query),
        ]);

        res.status(200).json({ tweets, users });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
};

export const checkUsername = async (req: Request, res: Response) => {
    const username = req.query.username as string;

    try {
        const taken = await SearchService.isUsernameTaken(username);
        res.status(200).json({
            exists: taken,
            message: taken ? 'Username already taken' : 'Username is available',
        });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }


};

export const checkEmail = async (req: Request, res: Response) => {
    const email = req.query.email as string;

    try {
        const taken = await SearchService.isEmailTaken(email);
        res.status(200).json({
            exists: taken,
            message: taken ? 'Email already in use' : 'Email is available',
        });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }

};