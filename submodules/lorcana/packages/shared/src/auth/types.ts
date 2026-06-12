/**
 * Shared authentication types
 *
 * These types are used across the API, web app, and any other packages
 * that need to work with Better Auth session data.
 */

/**
 * User role for authorization
 */
export type UserRole = "user" | "donor" | "moderator" | "admin";

/**
 * Subscription tier levels.
 *
 * `"free"` is the implicit default for users with no Stripe subscription
 * (new signups, and anyone who has cancelled). It is intentionally distinct
 * from `"tier1"`, which is preserved for legacy paid tier-1 customers
 * migrated from lorcanito and ranks just above "free" in tier ordering.
 */
export type SubscriptionTier = "free" | "tier1" | "tier2" | "tier3" | "tier4" | "tier5" | "tier6";

/**
 * User type from Better Auth session
 *
 * Custom DB columns are surfaced on the session payload via `user.additionalFields`
 * in apps/api/src/auth/auth.ts. To expose a new column here, declare it both on
 * this interface AND in the `additionalFields` block on the API.
 */
export interface AuthUser {
  id: string;
  email: string;
  /** Primary identifier from the OAuth provider (e.g. Discord username). Read-only. */
  name: string;
  image?: string | null;
  /** OAuth provider handle. Read-only. */
  username?: string | null;
  /**
   * User-chosen display name, editable via Account Settings.
   * Stored as `users.displayUsername`; surfaced on the Better Auth session via
   * `user.additionalFields` on the API. Patched optimistically on save.
   */
  displayUsername?: string | null;
  emailVerified: boolean;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Check if user has admin role
 */
export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin";
}

/**
 * Check if user has moderator or admin role
 */
export function isModerator(user: AuthUser | null): boolean {
  return user?.role === "moderator" || user?.role === "admin";
}

/**
 * Check if user has required subscription tier or higher
 */
export function hasSubscriptionTier(user: AuthUser | null, minTier: SubscriptionTier): boolean {
  const tiers: SubscriptionTier[] = ["free", "tier1", "tier2", "tier3", "tier4", "tier5", "tier6"];
  const userTierIndex = tiers.indexOf(user?.subscriptionTier ?? "free");
  const minTierIndex = tiers.indexOf(minTier);
  return userTierIndex >= minTierIndex;
}

/**
 * Check if user has donor role (past supporters migrated from lorcanito)
 */
export function isDonor(user: AuthUser | null): boolean {
  return user?.role === "donor";
}

/**
 * Lorcanito user settings (migrated as-is into users.settings jsonb).
 *
 * These settings originate from lorcanito and are preserved for continuity.
 * TCG-specific settings should be added as new top-level keys.
 */
export interface LorcanitoUserSettings {
  language?: "EN" | "DE" | "FR" | "ZH" | "JA";
  remoteCursor?: boolean;
  tablePerspective?: boolean;
  sound?: boolean;
  disableLogs?: boolean;
  disablePreview?: boolean;
  cardsSize?: "small" | "normal" | "big";
  sleeve?: "default" | "white" | "yellow" | "cosmos" | "custom";
  playmat?: {
    opacity: "none" | "low" | "medium" | "high" | "full" | "";
    position: "top" | "bottom" | "center" | "";
    size: "cover" | "contain" | "auto" | "";
    mirror: "none" | "vertically" | "horizontally" | "";
    hideOverlays?: boolean;
    image: string;
  };
  chat?: {
    logsEnabled: boolean;
    chatEnabled: boolean;
    extendedLogsEnabled: boolean;
  };
}

/**
 * Session type from Better Auth
 */
export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session result type for server responses
 * This matches the structure returned by auth.api.getSession()
 */
export interface SessionResult {
  user: AuthUser | null;
  session: AuthSession | null;
}
