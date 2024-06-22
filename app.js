import express from "express";
import Redis from "ioredis";
import bodyParser from "body-parser";
import { getUsers, getUsersDetails } from "./api/users.js";
import { exitCatch, maxRequest } from "./middleware/redis.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export const redis = new Redis({
  host: "redis-12286.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: 12286,
  password: "TW3ktUbOzi9P4NSmfK0CvWnMkaTZ6qpw",
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

app.get(
  "/users",
  maxRequest({ limit: 5, timer: 20, key: "users" }),
  exitCatch("users"),
  async (req, res) => {
    try {
      users = await getUsers();
      await redis.set("users", JSON.stringify(users.users));
      res.send({ users });
    } catch (error) {
      res.status(500).send("Error fetching users");
    }
  }
);

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const key = `user:${id}`;
  let user = await redis.get(key);
  if (user) {
    return res.json({
      user: JSON.parse(user),
    });
  }
  user = await getUsersDetails(id);
  await redis.set(key, JSON.stringify(user));
  res.status(200).json({
    status: 200,
    message: "User get successfully",
    data: user,
  });
});

//rate limiting
app.get(
  "/",
  maxRequest({ limit: 5, timer: 20, key: "home" }),
  async (req, res) => {
    res.send(`Hello World : ${req.requestCount}`);
  }
);
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
