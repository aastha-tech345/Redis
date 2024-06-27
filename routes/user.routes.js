const express = require("express");
const {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controllers");

const userRoutes = express.Router();

userRoutes.post("/create", createUser);
userRoutes.get("/", getUser);
userRoutes.get("/:id", getUserById);
userRoutes.put("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);

module.exports = userRoutes;
