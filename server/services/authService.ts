import { prisma } from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

export const register = async (emal: string, name: string, username: string, password: string) => {
    const hash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email: emal,
            name: name,
            username: username,
            password: hash
        }
    });

    const token = generateToken({ id: user.id });

    return { user, token };
}

export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error('User not found');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error('Invalid Credentials');

    const token = generateToken({ id: user.id });

    return { user, token };

}