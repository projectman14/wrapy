import { prisma } from '../config/prisma';

export const createPost = async (user: any, content: string, mediaUrl: string) => {
    if (!content || content.length > 280) throw new Error('Tweet content is required and max 280 characters');

    const tweet = await prisma.tweet.create({
        data: {
            content,
            mediaUrl,
            userId: user.id,
        },
    });

    return tweet;
}

export const getFeed = async (user: any) => {
    const following = await prisma.follower.findMany({
        where: { followerId: user.id },
        select: { followingId: true },
    });

    const ids = following.map(f => f.followingId).concat(user.id);

    const tweets = await prisma.tweet.findMany({
        where: {
            userId: { in: ids },
        },
        orderBy: { createdAt: 'desc' },
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

    return tweets;
}