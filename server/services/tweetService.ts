import { prisma } from '../config/prisma';
import { extractMentions } from '../utils/extractMention';
import redis from '../utils/redis';

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

    const mentionedUsernames = extractMentions(content);

    if (mentionedUsernames.length) {
        const mentionedUsers = await prisma.user.findMany({
            where: {
                username: { in: mentionedUsernames },
            },
            select: { id: true },
        });

        await prisma.mention.createMany({
            data: mentionedUsers.map((u) => ({
                tweetId: tweet.id,
                userId: u.id,
            })),
            skipDuplicates: true,
        });
    }


    return tweet;
}

export const createTweetWithMediaService = async (
    userId: number,
    content: string,
    mediaUrl: string | null,
    parentId: number,
    threadRootId: number,
    quoteOfId: number
) => {

    if (!content || content.length > 280) throw new Error('Tweet content is required and max 280 characters');

    const tweet = await prisma.tweet.create({
        data: {
            content,
            mediaUrl,
            userId,
            parentId,
            threadRootId,
            quoteOfId
        },
    });

    const mentionedUsernames = extractMentions(content);

    if (mentionedUsernames.length) {
        const mentionedUsers = await prisma.user.findMany({
            where: {
                username: { in: mentionedUsernames },
            },
            select: { id: true },
        });

        await prisma.mention.createMany({
            data: mentionedUsers.map((u) => ({
                tweetId: tweet.id,
                userId: u.id,
            })),
            skipDuplicates: true,
        });
    }

    return tweet;
};


export const getFeed = async (user: any, limit = 20, cursor?: number) => {

    const cacheKey = `user:feed:${user.id}:${cursor || 'start'}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    const following = await prisma.follower.findMany({
        where: { followerId: user.id },
        select: { followingId: true },
    });

    const ids = following.map(f => f.followingId).concat(user.id);

    const tweets = await prisma.tweet.findMany({
        where: {
            userId: { in: ids },
            threadRootId: null
        },
        orderBy: {
            createdAt: "desc",
        },
        take: limit + 1,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    avatarUrl: true,
                },
            },
            likes: {
                select: { userId: true },
            },
            threadRoot: {
                select: {
                    id: true,
                    content: true,
                    user: {
                        select: { id: true, username: true },
                    },
                },
            },
            quoteOf: {
                select: {
                    id: true,
                    content: true,
                    user: {
                        select: { id: true, username: true },
                    },
                },
            },
            replies: {

            }
        },
    });

    const hasNext = tweets.length > limit;
    const result = hasNext ? tweets.slice(0, limit) : tweets;
    const nextCursor = hasNext ? tweets[limit].id : null;

    await redis.set(cacheKey, JSON.stringify({ tweets: result, nextCursor }), {
        EX: 60,
    });

    return {
        tweets: result,
        nextCursor,
    };
};

export const getExploreFeed = async (limit = 20, cursor?: number) => {

    const cacheKey = `explore:feed:${limit}:${cursor ?? 'start'}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    const tweets = await prisma.tweet.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: limit + 1,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    name: true,
                    avatarUrl: true,
                },
            },
            likes: {
                select: { userId: true },
            },
            threadRoot: {
                select: {
                    id: true,
                    content: true,
                    user: { select: { id: true, username: true } },
                },
            },
            quoteOf: {
                select: {
                    id: true,
                    content: true,
                    user: { select: { id: true, username: true } },
                },
            },
        },
    });

    const hasNext = tweets.length > limit;
    const result = hasNext ? tweets.slice(0, limit) : tweets;
    const nextCursor = hasNext ? tweets[limit].id : null;
    const response = {
        tweets: result,
        nextCursor,
    };


    await redis.set(cacheKey, JSON.stringify(response), {
        EX: 60,
    });

    return response;
};


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

export const addBookmark = async (userId: number, tweetId: number) => {

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('Invalid User Id');

    const tweet = await prisma.tweet.findUnique({ where: { id: tweetId } });

    if (!tweet) throw new Error('Invalid tweet Id');

    return await prisma.bookmark.create({
        data: { userId, tweetId },
    });
};

export const removeBookmark = async (userId: number, tweetId: number) => {

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('Invalid User Id');

    const tweet = await prisma.tweet.findUnique({ where: { id: tweetId } });

    if (!tweet) throw new Error('Invalid tweet Id');

    return await prisma.bookmark.delete({
        where: {
            userId_tweetId: { userId, tweetId },
        },
    });
};

export const getBookmarks = async (userId: number) => {

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('Invalid User Id');

    return await prisma.bookmark.findMany({
        where: { userId },
        include: {
            tweet: {
                include: {
                    user: {
                        select: { id: true, username: true, name: true, avatarUrl: true },
                    },
                    likes: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

