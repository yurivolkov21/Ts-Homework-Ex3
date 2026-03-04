import { hashPassword } from "../../utils/crypto.js";
import { ApiError } from "../../utils/http.js";
import type { UserDatabase, UserEntity } from "./user.database.js";
import type { UserRole } from "./user.model.js";

// Regex helpers
const UPPERCASE_RE = /[A-Z]/;
const SPECIAL_CHAR_RE = /[!@#$%^&*()\-_=+\[\]{};':",.<>?/\\|`~]/;

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

    // Validate email
    if (!email.includes("@"))
      throw new ApiError(400, { message: "Invalid email." });

    // Validate password length
    if (input.password.length < 6)
      throw new ApiError(400, {
        message: "Password must be at least 6 characters.",
      });

    // Bắt lỗi ký tự đặc biệt & chữ viết hoa
    if (!UPPERCASE_RE.test(input.password))
      throw new ApiError(400, {
        message: "Password must contain at least one uppercase letter.",
      });

    if (!SPECIAL_CHAR_RE.test(input.password))
      throw new ApiError(400, {
        message: "Password must contain at least one special character.",
      });

    // Bắt lỗi trùng email
    const existed = await this.userDb.findByEmail(email);
    if (existed)
      throw new ApiError(409, { message: "Email already exists." });

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

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.userDb.findByEmail(email.trim().toLowerCase());
    if (!user) throw new ApiError(404, { message: "User not found." });
    return user;
  }

  async getById(id: string): Promise<UserEntity> {
    const user = await this.userDb.findById(id);
    if (!user) throw new ApiError(404, { message: "User not found." });
    return user;
  }

  async updateById(
    id: string,
    input: { email?: string; password?: string; role?: UserRole }
  ): Promise<UserEntity> {
    const update: Parameters<UserDatabase["updateById"]>[1] = {};

    if (input.email !== undefined) {
      const email = input.email.trim().toLowerCase();
      if (!email.includes("@"))
        throw new ApiError(400, { message: "Invalid email." });

      // Check if new email already belongs to another user
      const existing = await this.userDb.findByEmail(email);
      if (existing && existing._id.toString() !== id)
        throw new ApiError(409, { message: "Email already exists." });

      update.email = email;
    }

    if (input.password !== undefined) {
      if (input.password.length < 6)
        throw new ApiError(400, {
          message: "Password must be at least 6 characters.",
        });
      if (!UPPERCASE_RE.test(input.password))
        throw new ApiError(400, {
          message: "Password must contain at least one uppercase letter.",
        });
      if (!SPECIAL_CHAR_RE.test(input.password))
        throw new ApiError(400, {
          message: "Password must contain at least one special character.",
        });
      update.passwordHash = await hashPassword(input.password);
    }

    if (input.role !== undefined) {
      update.role = input.role;
    }

    const user = await this.userDb.updateById(id, update);
    if (!user) throw new ApiError(404, { message: "User not found." });
    return user;
  }

  async deleteById(id: string): Promise<void> {
    const deleted = await this.userDb.deleteById(id);
    if (!deleted) throw new ApiError(404, { message: "User not found." });
  }
}
