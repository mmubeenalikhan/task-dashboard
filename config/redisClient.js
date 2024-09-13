const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis(process.env.REDIS_CONNECTION);

module.exports = redis;
