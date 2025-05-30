// utils/redis.js
const { createClient } = require('redis');

// Redis 클라이언트 생성
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

// 이벤트 리스너: 에러
redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

// 이벤트 리스너: 연결 성공
redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

// 클라이언트 연결 시도
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('❌ Redis failed to connect:', err);
  }
})();

module.exports = redisClient;
