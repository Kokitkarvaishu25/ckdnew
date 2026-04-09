import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import predictionRoutes from "./routes/predictionRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  }),
);
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/predictions", predictionRoutes);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
    return res.status(409).json({ message: "email already exists" });
  }

  if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
    return res.status(401).json({ message: "invalid email or password" });
  }

  if (error instanceof Error && error.message.toLowerCase().includes("no such file")) {
    return res.status(500).json({ message: "model artifacts missing. run phase-1 training first" });
  }

  return res.status(500).json({ message: "internal server error" });
});

export default app;
