
import "dotenv/config";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is missing");
  }

  const sql = postgres(url, {
    ssl: "require",
    prepare: false,
    connect_timeout: 10,
  });

  try {
    const result = await sql`SELECT current_database(), NOW()`;
    console.log("✅ Database connected successfully:", result);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await sql.end();
  }
}

main();
