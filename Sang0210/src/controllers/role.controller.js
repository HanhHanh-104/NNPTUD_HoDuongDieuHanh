import { Role } from "../models/Role.js";

/**
 * Create Role
 */
export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.create({ name, description });
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Get all roles
 */
export const getRoles = async (req, res) => {
  try {
    const { name } = req.query;
    const query = { isDelete: false };
    if (name) query.name = { $regex: name, $options: "i" };
    const roles = await Role.find(query).sort({ createdAt: -1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get role by id
 */
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, isDelete: false });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(400).json({ message: "Invalid role id" });
  }
};

/**
 * Get role by name
 */
export const getRoleByName = async (req, res) => {
  try {
    const role = await Role.findOne({ name: req.params.name, isDelete: false });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update
 */
export const updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      { $set: { name, description } },
      { new: true, runValidators: true }
    );
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Soft delete 
 */
export const softDeleteRole = async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      { $set: { isDelete: true } },
      { new: true }
    );
    if (!role) return res.status(404).json({ message: "Role not found or already deleted" });
    res.json({ message: "Role soft-deleted", role });
  } catch (err) {
    res.status(400).json({ message: "Invalid role id" });
  }
};
