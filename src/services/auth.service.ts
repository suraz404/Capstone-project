import { AppError } from "../errors/AppError.js";
import {
  findUserByEmail,
  createUser,
} from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";

export async function registerUser(
  email: string,
  password: string,
): Promise<void> {
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }
  if (password.length < 6) {
    throw new AppError("Password must be 6 character long", 400);
  }

  const normalizeEmail = email.toLowerCase().trim();

  const existingUser = await findUserByEmail(normalizeEmail);

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const password_hash = await bcrypt.hash(password, 10);

  await createUser(normalizeEmail, password_hash);
}
