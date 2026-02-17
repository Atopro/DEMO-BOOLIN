import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // hashed
  role: text("role", { enum: ["admin", "client"] })
    .notNull()
    .default("client"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status", {
    enum: [
      "brief",
      "concept",
      "iteration",
      "feedback",
      "delivered",
      "archived",
    ],
  })
    .notNull()
    .default("brief"),
  clientType: text("client_type", { enum: ["novy", "existujuci"] }),
  service: text("service", { enum: ["brand", "web", "tlac"] }),
  styleTags: text("style_tags", { mode: "json" }).$type<string[]>().default([]),
  colors: text("colors", { mode: "json" }).$type<string[]>().default([]),
  items: text("items", { mode: "json" }).$type<string[]>().default([]),
  notes: text("notes").default(""),
  links: text("links", { mode: "json" }).$type<string[]>().default([]),
  contactName: text("contact_name").default(""),
  contactEmail: text("contact_email").default(""),
  contactPhone: text("contact_phone").default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  isInternal: integer("is_internal", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  status: text("status", { enum: ["draft", "sent", "paid"] })
    .notNull()
    .default("draft"),
  fileUrl: text("file_url"),
  notes: text("notes").default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const projectStatusHistory = sqliteTable("project_status_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  changedBy: integer("changed_by")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type ProjectStatusHistory = typeof projectStatusHistory.$inferSelect;
export type NewProjectStatusHistory = typeof projectStatusHistory.$inferInsert;
