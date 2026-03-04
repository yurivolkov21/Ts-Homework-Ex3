import { hashPassword } from "../../utils/crypto.js";
import { ApiError } from "../../utils/http.js";
import type { UserDatabase, UserEntity } from "./user.database.js";
import type { UserRole } from "./user.model.js";

export class UserService {
  constructor(private readonly userDb: UserDatabase) {}

  async list() {
    return this.userDb.list();
  }

  async register(input: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<UserEntity> {
    const email = input.email.trim().toLowerCase();
    if (!email.includes("@"))
      throw new ApiError(400, { message: "Invalid Email." });

    if (input.password.length < 6)
      throw new ApiError(400, {
        message: "Password must be higher than 6 characters.",
      });

    // btvn: bắt lỗi ký tự đặc biệt & chữ viết hoa
    const existed = await this.userDb.findByEmail(email);

    // bắt lỗi trùng
    const now = new Date();

    const passwordHash = await hashPassword(input.password);

    const role: UserRole = input.role || "customer";

    return this.userDb.create({
      email,
      passwordHash,
      role,
      createdAt: now,
      updatedAt: now,
    });
  }
}
