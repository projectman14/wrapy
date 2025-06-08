import { prisma } from '../config/prisma';

export const createPost = async (user: any, content: string, mediaUrl: string, parentId: number, threadRootId: number, quoteOfId: number) => {
    if (!content || content.length > 280) throw new Error('Tweet content is required and max 280 characters');

    const tweet = await prisma.tweet.create({
        data: {
            content,
            mediaUrl,
            userId: user.id,
            parentId,
            threadRootId,
            quoteOfId
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

export const likeTweet = async (user: any, tweetId: number) => {

    if (!user) throw new Error('User not found');

    const tweet = await prisma.tweet.findUnique({
        where: { id: tweetId }
    });

    if (!tweet) throw new Error('Tweet not found');

    const like = await prisma.like.create({
        data: {
            userId: user.id,
            tweetId: tweetId
        },
    });

    return { like, tweet };
}

export const unlikeTweet = async (user: any, tweetId: number) => {
    if (!user) throw new Error('User not found');

    const tweet = await prisma.tweet.findUnique({
        where: { id: tweetId }
    });

    if (!tweet) throw new Error('Tweet not found');

    await prisma.like.delete({
        where: {
            userId_tweetId: {
                userId: user.id,
                tweetId: tweetId
            },
        },
    });
}

export const getRepliesForTweet = async (tweetId: number) => {

    if (isNaN(tweetId)) throw new Error("Invalid tweet ID");

    const tweet = await prisma.tweet.findUnique({
        where: { id: tweetId }
    });

    if (!tweet) throw new Error('Tweet not found');

    const replies = await prisma.tweet.findMany({
        where: {
            parentId: tweetId,
        },
        include: {
            user: {
                select: { id: true, username: true, name: true, avatarUrl: true }
            },
            likes: true,
        },
        orderBy: {
            createdAt: 'asc',
        }
    });

    return replies;
};

export const getThread = async (tweetId: number) => {
    if (isNaN(tweetId)) throw new Error("Invalid tweet ID");

    const tweet = await prisma.tweet.findUnique({
        where: { id: tweetId },
        select: { id: true, threadRootId: true }
    });

    if (!tweet) throw new Error('Tweet not found');

    const rootId = tweet.threadRootId ?? tweet.id;

    const threadTweets = await prisma.tweet.findMany({
        where: {
            OR: [
                { id: rootId },
                { threadRootId: rootId }
            ]
        },
        include: {
            user: { select: { id: true, username: true, name: true, avatarUrl: true } },
            likes: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    return threadTweets;
};

export const getQuoteTweets = async (tweetId: number) => {
    if (isNaN(tweetId)) throw new Error("Invalid tweet ID");
    const quotes = await prisma.tweet.findMany({
        where: {
            quoteOfId: tweetId,
        },
        include: {
            user: {
                select: { id: true, username: true, name: true, avatarUrl: true },
            },
            likes: true,
        },
        orderBy: {
            createdAt: 'asc',
        }
    });

    return quotes;
};

