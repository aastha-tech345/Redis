const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/my_database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const client = redis.createClient();

const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model("Item", ItemSchema);
client.on("connect", function () {
  console.log("Connected to Redis");
});

app.post("/items", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).send("Name and description are required");
    }

    const newItem = new Item({ name, description });
    await newItem.save();

    client.get("items", (err, data) => {
      if (err) {
        console.error("Error updating Redis cache:", err);
      } else {
        if (data) {
          const cachedItems = JSON.parse(data);
          cachedItems.push(newItem);
          client.setEx("items", 3600, JSON.stringify(cachedItems));
        }
      }
    });

    res.status(201).send("Item added successfully");
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/items", async (req, res) => {
  try {
    client.get("items", async (err, data) => {
      if (err) throw err;

      if (data) {
        console.log("Data fetched from Redis cache");
        res.send(JSON.parse(data));
      } else {
        const items = await Item.find();
        client.setex("items", 3600, JSON.stringify(items));
        console.log("Data fetched from MongoDB");
        res.send(items);
      }
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
