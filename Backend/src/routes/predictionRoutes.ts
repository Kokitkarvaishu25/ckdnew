import { Router } from "express";
import { predict, predictionMeta } from "../controllers/predictionController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/meta", authenticate, predictionMeta);
router.post("/predict", authenticate, predict);

export default router;
