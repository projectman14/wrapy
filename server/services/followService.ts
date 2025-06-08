import { prisma } from "../config/prisma";

export const followUser = async (followerId: number, followingId: number) => {
  if (followerId === followingId) throw new Error("You cannot follow yourself");

  return prisma.follower.create({
    data: {
      followerId,
      followingId,
    },
  });
};

export const unfollowUser = async (followerId: number, followingId: number) => {
  return prisma.follower.delete({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
};

export const getFollowers = async (userId: number) => {
  return prisma.follower.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: { id: true, username: true, name: true, avatarUrl: true },
      },
    },
  });
};

export const getFollowing = async (userId: number) => {
  return prisma.follower.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: { id: true, username: true, name: true, avatarUrl: true },
      },
    },
  });
};

export const isFollowing = async (followerId: number, followingId: number) => {
  const record = await prisma.follower.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  return !!record;
};

