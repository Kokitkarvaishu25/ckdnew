import jwt, { SignOptions } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "change-me-in-production";

export function signToken(payload: { userId: number; email: string }): string {
  const options: SignOptions = { expiresIn: "7d" };
  return jwt.sign(payload, jwtSecret, options);
}

export function verifyToken(token: string): { userId: number; email: string } {
  return jwt.verify(token, jwtSecret) as { userId: number; email: string };
}
