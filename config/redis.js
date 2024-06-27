const redis = require("redis");

const redisClient = redis.createClient({
  host: "127.0.0.1", // or your Redis server IP address
  port: 6379, // or your Redis server port
});

redisClient.connect();

redisClient.on("connect", () => {
  console.log("redis connected successfully");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redisClient;
