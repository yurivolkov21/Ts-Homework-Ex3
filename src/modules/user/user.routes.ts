import { Router } from "express";
import { UserDatabase } from "./user.database.js";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";

const router = Router();

const db = new UserDatabase();
const service = new UserService(db);
const controller = new UserController(service);

router.get("/", controller.list);
router.post("/", controller.register);

// GET One By Email  →  GET /api/users/search?email=...
router.get("/search", controller.getByEmail);

// GET One By ObjectId  →  GET /api/users/:id
router.get("/:id", controller.getById);

// PUT One By ObjectId  →  PUT /api/users/:id
router.put("/:id", controller.updateById);

// DELETE One By ObjectId  →  DELETE /api/users/:id
router.delete("/:id", controller.deleteById);

export const userRouters = router;
