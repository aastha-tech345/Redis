const app = require("./app");
const redisClient = require("./config/redis");
const startDatabase = require("./config/db");

const port = 8082;

const startServer = async () => {
  try {
    await startDatabase();
    app.listen(port, () => {
      console.log(`server is running on port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
