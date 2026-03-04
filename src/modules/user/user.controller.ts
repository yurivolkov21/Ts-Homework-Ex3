import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
import { ok } from "../../utils/http.js";
import { create } from "domain";

export class UserController {
  constructor(private readonly userService: UserService) {}

  list = async (_req: Request, res: Response) => {
    const users = await this.userService.list();
    res.json({ data: users });
  };

  // POST Register
  register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    const user = await this.userService.register({ email, password, role });

    res.status(201).json(
      ok({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
    );
  };

  // GET One By Email & GET One By ObjectId
  // PUT One By ObjectId
  // DELETE One By ObjectId
}
