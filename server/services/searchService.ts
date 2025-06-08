import { prisma } from '../config/prisma';

export const searchTweets = async (query: string, limit = 20) => {


    if (!query || query.trim() === '') {
        throw new Error('Search query is required');
    }


    return prisma.tweet.findMany({
        where: {
            content: {
                contains: query,
                mode: 'insensitive',
            },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                },
            },
        },
    });
};

export const searchUsers = async (query: string, limit = 20) => {

    if (!query || query.trim() === '') {
        throw new Error('Search query is required');
    }

    return prisma.user.findMany({
        where: {
            OR: [
                { username: { contains: query, mode: 'insensitive' } },
                { name: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            bio: true,
        },
    });
};

export const isUsernameTaken = async (username: string) => {

    if (!username) throw new Error('Username is Required');
    const user = await prisma.user.findUnique({
        where: { username },
    });
    return !!user;
};

export const isEmailTaken = async (email: string) => {

    if (!email) throw new Error('Email required');

    const user = await prisma.user.findUnique({
        where: { email },
    });
    return !!user;
};