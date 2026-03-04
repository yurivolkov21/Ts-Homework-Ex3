import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
import { ok } from "../../utils/http.js";

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

  // GET One By Email
  getByEmail = async (req: Request, res: Response) => {
    const { email } = req.query as { email: string };
    const user = await this.userService.getByEmail(email);
    res.json(
      ok({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
    );
  };

  // GET One By ObjectId
  getById = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getById(id);
    res.json(
      ok({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
    );
  };

  // PUT One By ObjectId
  updateById = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const { email, password, role } = req.body;

    const user = await this.userService.updateById(id, {
      email,
      password,
      role,
    });

    res.json(
      ok({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt,
      })
    );
  };

  // DELETE One By ObjectId
  deleteById = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    await this.userService.deleteById(id);
    res.json(ok({ message: "User deleted successfully." }));
  };
}
