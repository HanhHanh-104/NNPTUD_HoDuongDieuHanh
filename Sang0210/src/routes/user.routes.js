import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  softDeleteUser,
  verifyUserStatus
} from "../controllers/user.controller.js";

const router = Router();

// Create
router.post("/", createUser);

// Read
router.get("/", getUsers); 
router.get("/:id", getUserById);
router.get("/username/:username", getUserByUsername);

// Update
router.patch("/:id", updateUser);

// Soft Delete
router.delete("/:id", softDeleteUser);

// Verify (email + username -> status=true)
router.post("/verify", verifyUserStatus);

export default router;
