import Redis from 'ioredis';
import logger from '../utils/logger';
import { REDIS_URI_CONNECTION } from '../config/redis';

class RedisConnection {
    private static instance: Redis;

    public static getInstance(): Redis {
        if (!RedisConnection.instance) {
            RedisConnection.instance = new Redis(REDIS_URI_CONNECTION, {
                maxRetriesPerRequest: 1,
                enableReadyCheck: false,
                retryStrategy(times) {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                }
            });

            RedisConnection.instance.on('error', (error) => {
                logger.error(`[RedisConnection] Erro na conexão Redis: ${JSON.stringify(error)}`);
            });

            RedisConnection.instance.on('connect', () => {
                logger.info('Conectado ao Redis');
            });
        }

        return RedisConnection.instance;
    }
}

export const redisClient = RedisConnection.getInstance(); 