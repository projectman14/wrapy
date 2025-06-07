import { Request, Response } from 'express';
import * as AuthService from '../services/authService';
import { verifyToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
    const { email, name, username, password } = req.body;

    try {
        const { user, token } = await AuthService.register(email, name, username, password);
        res.status(201).json({ user, token });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({ error: err.message });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { user, token } = await AuthService.login(email, password);
        res.status(200).json({ user, token });
    } catch (error) {
        const err = error as Error;
        res.status(401).json({ error: err.message })
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.body;
    const decoded = verifyToken(token);
    const id = (decoded as JwtPayload).id;

    try {
        const user = AuthService.verifyEmail(id);
        res.status(200).json({ user });
    } catch (error) {
        const err = error as Error;
        res.status(401).json({ error: err.message })
    }
}