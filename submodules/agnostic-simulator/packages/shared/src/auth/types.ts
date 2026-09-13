import type { SettingsGameSlug } from "@tcg/game-page-contract/settings";

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
 * `"free"` is the implicit default for users with no active membership.
 * The only paid membership levels are tier2, tier3, and tier4.
 */
export type SubscriptionTier = "free" | "tier2" | "tier3" | "tier4";

/**
 * User type from Better Auth session
 *
 * Custom DB columns are surfaced on the session payload via `user.additionalFields`
 * in apps/api/src/auth/auth.ts. To expose a new column here, declare it both on
 * this interface AND in the `additionalFields` block on the API.
 */
export interface AuthUser {
  id: string;
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
  /** Account-wide game used for personalized entry points and navigation. */
  preferredGame?: SettingsGameSlug | null;
  emailVerified: boolean;
  /** True for a recoverability-free guest identity created without credentials. */
  isAnonymous: boolean;
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
  const tiers: SubscriptionTier[] = ["free", "tier2", "tier3", "tier4"];
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

/**
 * Canonical platform authentication context.
 *
 * Better Auth proves that a credential maps to a session. The platform API
 * additionally requires that session's user to exist in the canonical users
 * table before any product surface may treat the request as authenticated.
 */
export type CanonicalAuthContext =
  | {
      status: "authenticated";
      user: AuthUser;
      session: AuthSession;
    }
  | {
      status: "anonymous";
      user: null;
      session: null;
    }
  | {
      status: "invalid";
      reason: "canonical_user_missing";
      user: null;
      session: null;
    };
