import { User } from "../models/User.js";

/**
 * Create user
 */
export const createUser = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      fullName,
      avatarUrl,
      role,       
      status,     
      loginCount 
    } = req.body;

    const user = await User.create({
      username,
      password,
      email,
      fullName,
      avatarUrl,
      role,
      status,
      loginCount
    });

    
    await user.populate("role");
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Get all users
 */
export const getUsers = async (req, res) => {
  try {
    const { username, fullName } = req.query;
    const query = { isDelete: false };

    if (username) query.username = { $regex: username, $options: "i" };
    if (fullName) query.fullName = { $regex: fullName, $options: "i" };

    const users = await User.find(query).populate("role").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get user by id
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDelete: false }).populate("role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Invalid user id" });
  }
};

/**
 * Get user by username
 */
export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
      isDelete: false
    }).populate("role");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update user
 */
export const updateUser = async (req, res) => {
  try {
    const {
      password,
      email,
      fullName,
      avatarUrl,
      status,
      role,
      loginCount
    } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      {
        $set: {
          password,
          email,
          fullName,
          avatarUrl,
          status,
          role,
          loginCount
        }
      },
      { new: true, runValidators: true }
    ).populate("role");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Soft delete user
 */
export const softDeleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      { $set: { isDelete: true } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found or already deleted" });
    res.json({ message: "User soft-deleted", user });
  } catch (err) {
    res.status(400).json({ message: "Invalid user id" });
  }
};

/**
 * Body: { email: "...", username: "..." }
 */
export const verifyUserStatus = async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: "email and username are required" });
    }

    const user = await User.findOne({ email, username, isDelete: false });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or username" });
    }

    if (user.status === true) {
      return res.json({ message: "User already verified", user });
    }

    user.status = true;
    await user.save();

    res.json({ message: "User verified successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
