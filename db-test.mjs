import "dotenv/config";
import postgres from "postgres";
import dns from "node:dns/promises";

const u = new URL(process.env.DATABASE_URL);
console.log("Resolved:", await dns.lookup(u.hostname, { all: true }));

const sql = postgres(process.env.DATABASE_URL, { prepare: false, ssl: "require", connect_timeout: 10 });
try {
  console.log(await sql`select 1 as ok`);
} catch (e) {
  console.log("code:", e.code);
  console.log((e.errors ?? [e]).map((x) => `${x.address}:${x.port} ${x.code}`));
}
await sql.end();