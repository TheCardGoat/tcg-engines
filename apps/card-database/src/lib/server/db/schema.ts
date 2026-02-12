import { integer, pgTable, serial } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  age: integer("age"),
  id: serial("id").primaryKey(),
});
