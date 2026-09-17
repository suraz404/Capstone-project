import path from "node:path";
import fs from "node:fs/promises";

import { pool } from "../libs/db.js";
import { error } from "node:console";
import { logger } from "../libs/logger.js";

const MIGRATIONS_DIR = path.join(process.cwd(), "migration");

const CREATE_MIGRATION_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP NOT NULL DEFAULT NOW()
  )
`;

async function getExecutedMigrations(): Promise<Set<string>> {
  const result = await pool.query<{ name: string }>(
    "SELECT name FROM migrations ORDER BY id",
  );

  return new Set(result.rows.map((row) => row.name));
}

export async function migrate(): Promise<void> {
  const client = await pool.connect();

  try {
    // 1. Make sure migration table exists
    await client.query(CREATE_MIGRATION_TABLE_SQL);

    // 2. Get migrations already executed
    const executed = await getExecutedMigrations();

    // 3. Get migration files
    const files = (await fs.readdir(MIGRATIONS_DIR))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // 4. Run migrations one by one
    for (const file of files) {
      if (executed.has(file)) {
        continue;
      }

      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = await fs.readFile(filePath, "utf-8");

      console.log(`Running migration: ${file}`);

      try {
        // Start transaction
        await client.query("BEGIN");

        // Run migration SQL
        await client.query(sql);

        // Remember migration
        await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);

        // Everything worked
        await client.query("COMMIT");

        console.log(`✓ Migration completed: ${file}`);
      } catch (error) {
        // Something failed → undo everything
        await client.query("ROLLBACK");

        console.error(`✗ Migration failed: ${file}`);

        throw error;
      }
    }

    console.log("All migrations completed.");
  } catch (error) {
    console.error("Migration process failed:", error);

    throw error;
  } finally {
    // Always return the connection to the pool
    client.release();
  }
}

migrate()
  .catch((error) => {
    logger.error({ err: error }, "Migration failed");
    process.exit(1);
  })
  .finally(() => pool.end());
