import { createClient } from 'redis';

const redis = createClient();

redis.on('error', (err) => console.error('Redis Client Error', err));

export const initRedis = async () => {
    await redis.connect();
};

export default redis;