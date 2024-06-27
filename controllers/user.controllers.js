const UserDatabase = require("../models/user.model");
const redisClient = require("../config/redis");
const createUser = async (req, res) => {
  try {
    const user = await UserDatabase.create(req.body);
    redisClient.del("users");
    return res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    const cachedUser = await redisClient.get("users");

    if (cachedUser) {
      return res.status(200).json({
        success: true,
        isCachedData: true,
        message: "User Found Successfully",
        data: JSON.parse(cachedUser),
      });
    }
    const user = await UserDatabase.find();

    redisClient.set("users", JSON.stringify(user));

    return res.status(200).json({
      success: true,
      isCachedData: false,
      message: "User Found Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const isChachedUser = await redisClient.get(req.params.id);

    if (isChachedUser) {
      return res.status(200).json({
        success: true,
        isCachedData: true,
        message: "User Found Successfully",
        data: JSON.parse(isChachedUser),
      });
    }

    const user = await UserDatabase.findById(req.params.id);
    redisClient.set(req.params.id, JSON.stringify(user));
    return res.status(200).json({
      success: true,
      isCachedData: false,
      message: "User Found Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await UserDatabase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    redisClient.del("users");
    redisClient.del(req.params.id);
    return res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await UserDatabase.findByIdAndDelete(req.params.id);
    redisClient.del("users");
    redisClient.del(req.params.id);
    return res.status(200).json({
      success: true,
      message: "User deleted Successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
};
