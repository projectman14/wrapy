import { prisma } from '../config/prisma'
import redis from '../utils/redis';

export const getUserProfileStats = async (username: string) => {

    const cacheKey = `user:profileStats:${username}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

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

    await redis.set(cacheKey, JSON.stringify(user), { EX: 3600 });

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

    await redis.del(`user:profileStats:${updatedUser.username}`);

    return updatedUser;
};
