import { Request, Response } from 'express';
import * as AuthService from '../services/authService';

export const registerUser = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        const { user, token } = await AuthService.register(email, username, password);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const {user , token} = await AuthService.login(email , password);
        res.status(200).json({user,token});
    } catch (error) {
        res.status(401).json({error : error.message})
    }
}