import { NextFunction, Request, Response } from "express";
import { getPredictionMeta, predictCkd } from "../services/predictionService";

export async function predictionMeta(_req: Request, res: Response, next: NextFunction) {
  try {
    const meta = getPredictionMeta();
    return res.status(200).json(meta);
  } catch (error) {
    return next(error);
  }
}

export async function predict(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = (req.body || {}) as Record<string, unknown>;
    const result = await predictCkd(payload);

    return res.status(200).json({
      message: "prediction generated",
      result,
    });
  } catch (error) {
    return next(error);
  }
}
