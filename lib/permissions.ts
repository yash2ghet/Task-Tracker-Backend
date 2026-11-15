
// import { createAccessControl } from "better-auth/plugins/access";
// import {
//   defaultStatements,
//   adminAc,
// } from "better-auth/plugins/admin/access";

// const statement = {
//   ...defaultStatements,
//   task: ["create", "list", "get", "update", "delete"],
//   dashboard: ["view"],
// } as const;

// export const ac = createAccessControl(statement);

// export const admin = ac.newRole({
//   ...adminAc.statements,
//   task: ["create", "list", "get", "update", "delete"],
//   dashboard: ["view"]
// });

// export const manager = ac.newRole({
//   user: ["list", "get"],
//   session: [],
//   task: ["create", "list", "get", "update", "delete"],
//   dashboard: ["view"]
// });

// export const employee = ac.newRole({
//   user: [],
//   session: [],
//   task: ["list", "get", "update"],
// });

const permissions: Record<string, string[]> = {
  admin: [
    "task:create",
    "task:list",
    "task:get",
    "task:update",
    "task:delete",
    "dashboard:view",
    "user:list",
    "user:get",
    "user:create",
    "user:update",
    "user:delete",
    "user:set-role",
  ],

  manager: [
    "task:create",
    "task:list",
    "task:get",
    "task:update",
    "task:delete",
    "dashboard:view",
    "user:list",
    "user:get",
  ],

  employee: [
    "task:list",
    "task:get",
    "task:update",
  ],
};

export function hasPermission(role: string, permission: string) {
  if (!permissions[role]) {
    return false;
  }

  return permissions[role].includes(permission);
}