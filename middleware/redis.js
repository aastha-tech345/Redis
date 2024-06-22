import { redis } from "../app.js";

export const exitCatch = (key) => async (req, res, next) => {
  let users = await redis.get(key);
  if (users)
    return res.json({
      users: JSON.parse(users),
    });

  next();
};

export const maxRequest = (options = {}) => {
  const { limit = 5, timer = 20, key } = options;

  return async (req, res, next) => {
    try {
      const clientIp =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const redisKey = `${clientIp}:${key}:request_count`;
      const data = await redis.incr(redisKey);
      if (data === 1) {
        await redis.expire(redisKey, timer);
      }

      const timeRemaining = await redis.ttl(redisKey);

      if (data > limit) {
        return res
          .status(429)
          .send(
            `Too many requests. Please try again after ${timeRemaining} seconds`
          );
      }

      req.requestCount = data;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };
};

exitCatch();
maxRequest();
