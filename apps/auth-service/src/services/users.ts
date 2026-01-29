import { eq } from "drizzle-orm";
import { getDb } from "../db/client";
import { type User, users } from "../db/schema";

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] ?? null;
}

/**
 * Update user profile input
 */
export interface UpdateUserInput {
  name?: string;
  username?: string;
  displayUsername?: string;
  image?: string;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateUserInput,
): Promise<User | null> {
  const db = getDb();

  // Build update object with only provided fields
  const updateData: Partial<typeof users.$inferInsert> = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }
  if (data.username !== undefined) {
    updateData.username = data.username;
  }
  if (data.displayUsername !== undefined) {
    updateData.displayUsername = data.displayUsername;
  }
  if (data.image !== undefined) {
    updateData.image = data.image;
  }

  // Only update if there are fields to update
  if (Object.keys(updateData).length === 0) {
    return getUserById(userId);
  }

  const result = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning();

  return result[0] ?? null;
}

/**
 * Delete user (soft delete by marking as deleted)
 *
 * Note: Better Auth handles cascade deletion of sessions and accounts.
 * This function can be extended for soft delete if needed.
 */
export async function deleteUser(userId: string): Promise<boolean> {
  const db = getDb();

  const result = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning({ id: users.id });

  return result.length > 0;
}
