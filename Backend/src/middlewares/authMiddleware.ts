import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "authorization token missing" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "invalid or expired token" });
  }
}
