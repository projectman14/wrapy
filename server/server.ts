import app from './app';
import dotenv from 'dotenv';
import { initRedis } from './utils/redis';

dotenv.config();

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await initRedis();
        console.log('Redis connected');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();