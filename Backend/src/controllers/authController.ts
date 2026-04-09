import { NextFunction, Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "password must be at least 6 characters",
      });
    }

    const data = await registerUser({ name, email, password });
    return res.status(201).json(data);
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const data = await loginUser({ email, password });
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}
