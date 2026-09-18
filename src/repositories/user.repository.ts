import { DBUserRow, User } from "../types/users.js";
import { pool } from "../libs/db.js";

export async function findUserByEmail(email: string): Promise<User> {
  const result = await pool.query<DBUserRow>(
    "SELECT id,email,role,created_At FROM users WHERE email=$1",
    [email],
  );
  return result.rows[0] ?? null;
}

export async function createUser(
  normalizeEmail: string,
  password_hash: string,
): Promise<User> {
  const result = await pool.query<DBUserRow>(
    `INSERT INTO users(email,password_hash)
    VALUES($1,$2)
    RETURNING id, email , role ,created_at
     `,
    [normalizeEmail, password_hash],
  );

  return result.rows[0];
}
