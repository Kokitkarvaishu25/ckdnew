import { Router } from "express";
import { getUser, listUsers, me } from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticate, listUsers);
router.get("/me", authenticate, me);
router.get("/:id", authenticate, getUser);

export default router;
