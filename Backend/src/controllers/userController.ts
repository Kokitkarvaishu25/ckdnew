import { NextFunction, Request, Response } from "express";
import { getAllUsers, getUserById } from "../services/userService";

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "invalid user id" });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const user = await getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}
