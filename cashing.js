const Redis = require("ioredis");
const { REDIS_HOST, REDIS_PORT, REDIS_TTL, REDIS_TIMEOUT } = process.env;

let redis;