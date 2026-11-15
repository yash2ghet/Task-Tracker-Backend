
// import { betterAuth } from "better-auth";
// import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { admin as adminPlugin } from "better-auth/plugins";

// import { db } from "../src/config/db";
// import * as schema from "../src/db/schema";
// import { env } from "../src/config/env";

// import {
//   ac,
//   admin,
//   manager,
//   employee,
// } from "../lib/permissions";

// export const auth = betterAuth({
//   database: drizzleAdapter(db, {
//     provider: "pg",
//     schema,
//   }),

//   plugins: [
//     adminPlugin({
//       ac,
//       roles: { admin, manager, employee },
//       defaultRole: "employee",
//     })
//   ],

//   baseURL: process.env.BETTER_AUTH_URL,

//   secret: process.env.BETTER_AUTH_SECRET,

//   trustedOrigins: [env.FRONTEND_URL],

//   emailAndPassword: {
//     enabled: true,
//   },
// });

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../src/config/db";
import * as schema from "../src/db/schema";
import { env } from "../src/config/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [env.FRONTEND_URL],

  emailAndPassword: {
    enabled: true,
  },
});