import { prisma } from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { sendVerificationEmail } from '../utils/sendmail';

export const register = async (email: string, name: string, username: string, password: string) => {
    const hash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email: email,
            name: name,
            username: username,
            password: hash
        }
    });

    const token = generateToken({ id: user.id });

    await sendVerificationEmail(email, token);

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

export const verifyEmail = async (user_id: number) => {

    const user = await prisma.user.findUnique({ where: { id: user_id } });

    if (!user) throw new Error('User not found');

    const updateUser = await prisma.user.update({
        where: { id: user_id },
        data: { mail_verified: true }
    });

    const userUpdated = await prisma.user.findUnique({ where: { id: user_id } });

    return userUpdated;
}