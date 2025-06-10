import { prisma } from '../config/prisma'

export const getUserProfileStats = async (username: string) => {
    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            bio: true,
            createdAt: true,
            _count: {
                select: {
                    tweets: true,
                    followers: true,
                    following: true
                },
            },
        },
    });

    if (!user) throw new Error('User not found');

    return user;
};

export const updateProfile = async (
    userId: number,
    bio?: string,
    avatarUrl?: string
) => {
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            bio,
            avatarUrl,
        },
        select: {
            id: true,
            username: true,
            bio: true,
            avatarUrl: true,
        },
    });

    return updatedUser;
};
