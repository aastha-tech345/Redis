const mongoose = require("mongoose");

mongoose.connection.on("open", () => {
  console.log("database connected successfully");
});

mongoose.connection.on("end", () => {
  console.log("database not connected");
});

const url = "mongodb://127.0.0.1:27017/redis";
const startDatabase = async () => {
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.log(error);
  }
};

module.exports = startDatabase;
