import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../db/client";
import {
  type DigestPreference,
  type NewDigestPreference,
  type UserSubscription,
  digestHistory,
  digestPreferences,
  userSubscriptions,
} from "../db/schema";

/**
 * Get user's creator subscriptions
 */
export async function getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
  const db = getDb();
  return db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));
}

/**
 * Add a creator subscription
 */
export async function addSubscription(
  userId: string,
  creatorId: string,
  gameId?: string,
): Promise<UserSubscription> {
  const db = getDb();

  const result = await db
    .insert(userSubscriptions)
    .values({
      creatorId,
      gameId: gameId ?? null,
      userId,
    })
    .returning();

  const subscription = result[0];
  if (!subscription) {
    throw new Error("Failed to create subscription");
  }
  return subscription;
}

/**
 * Remove a creator subscription
 */
export async function removeSubscription(userId: string, creatorId: string): Promise<boolean> {
  const db = getDb();

  const result = await db
    .delete(userSubscriptions)
    .where(and(eq(userSubscriptions.userId, userId), eq(userSubscriptions.creatorId, creatorId)))
    .returning({ id: userSubscriptions.id });

  return result.length > 0;
}

/**
 * Get user's digest preferences
 */
export async function getDigestPreferences(userId: string): Promise<DigestPreference | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(digestPreferences)
    .where(eq(digestPreferences.userId, userId))
    .limit(1);

  return result[0] ?? null;
}

/**
 * Update digest preferences input
 */
export interface UpdateDigestInput {
  frequency?: "daily" | "weekly";
  deliveryTime?: string;
  isActive?: boolean;
}

/**
 * Update or create digest preferences
 */
export async function updateDigestPreferences(
  userId: string,
  data: UpdateDigestInput,
): Promise<DigestPreference> {
  const db = getDb();

  // Check if preferences exist
  const existing = await getDigestPreferences(userId);

  if (existing) {
    // Update existing preferences
    const updateData: Partial<NewDigestPreference> = {
      updatedAt: new Date(),
    };

    if (data.frequency !== undefined) {
      updateData.frequency = data.frequency;
    }
    if (data.deliveryTime !== undefined) {
      updateData.deliveryTime = data.deliveryTime;
    }
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    const result = await db
      .update(digestPreferences)
      .set(updateData)
      .where(eq(digestPreferences.userId, userId))
      .returning();

    const updated = result[0];
    if (!updated) {
      throw new Error("Failed to update digest preferences");
    }
    return updated;
  }

  // Create new preferences
  const result = await db
    .insert(digestPreferences)
    .values({
      deliveryTime: data.deliveryTime ?? "09:00:00",
      frequency: data.frequency ?? "daily",
      isActive: data.isActive ?? false,
      userId,
    })
    .returning();

  const created = result[0];
  if (!created) {
    throw new Error("Failed to create digest preferences");
  }
  return created;
}

/**
 * Get digest history for a user
 */
export async function getDigestHistory(userId: string, limit = 10) {
  const db = getDb();
  return db
    .select()
    .from(digestHistory)
    .where(eq(digestHistory.userId, userId))
    .orderBy(desc(digestHistory.sentAt))
    .limit(limit);
}
