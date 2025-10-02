import { Router } from "express";
import {
  createRole,
  getRoles,
  getRoleById,
  getRoleByName,
  updateRole,
  softDeleteRole
} from "../controllers/role.controller.js";

const router = Router();

// Create
router.post("/", createRole);

// Read
router.get("/", getRoles);                
router.get("/:id", getRoleById);
router.get("/name/:name", getRoleByName);

// Update
router.patch("/:id", updateRole);

// Soft Delete
router.delete("/:id", softDeleteRole);

export default router;
