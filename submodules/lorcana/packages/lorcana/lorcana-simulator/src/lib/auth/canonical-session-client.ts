import type { AuthSession, AuthUser } from "@tcg/shared/auth";
import { getApiOrigin } from "$lib/config/public-url-config.js";

type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type CanonicalSessionResult = { user: AuthUser; session: AuthSession };

/**
 * Fetch the platform-owned, email-free session projection.
 *
 * Better Auth endpoints are intentionally reserved for authentication actions.
 * Product session reads must go through `/v1/auth/session`, which also verifies
 * that the session still belongs to a canonical platform user.
 */
export async function fetchCanonicalSession(
  fetcher: Fetch = globalThis.fetch,
): Promise<CanonicalSessionResult | null> {
  const response = await fetcher(`${getApiOrigin()}/v1/auth/session`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Canonical auth session request failed with status ${response.status}.`);
  }
  return parseCanonicalSession(await response.json());
}

/** Rebuild the public session contract instead of trusting extra response keys. */
export function parseCanonicalSession(value: unknown): CanonicalSessionResult | null {
  const root = objectValue(value);
  if (root?.status !== "authenticated") return null;

  const user = normalizeUser(root.user);
  const session = normalizeSession(root.session);
  return user && session && session.userId === user.id ? { user, session } : null;
}

function normalizeUser(value: unknown): AuthUser | null {
  const user = objectValue(value);
  const createdAt = dateValue(user?.createdAt);
  const updatedAt = dateValue(user?.updatedAt);
  const subscriptionExpiresAt = nullableDateValue(user?.subscriptionExpiresAt);
  if (
    !user ||
    typeof user.id !== "string" ||
    typeof user.name !== "string" ||
    typeof user.emailVerified !== "boolean" ||
    !isUserRole(user.role) ||
    !isSubscriptionTier(user.subscriptionTier) ||
    !createdAt ||
    !updatedAt ||
    subscriptionExpiresAt === undefined ||
    !isOptionalString(user.image) ||
    !isOptionalString(user.username) ||
    !isOptionalString(user.displayUsername)
  ) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    image: optionalString(user.image),
    username: optionalString(user.username),
    displayUsername: optionalString(user.displayUsername),
    emailVerified: user.emailVerified,
    role: user.role,
    subscriptionTier: user.subscriptionTier,
    subscriptionExpiresAt,
    createdAt,
    updatedAt,
  };
}

function normalizeSession(value: unknown): AuthSession | null {
  const session = objectValue(value);
  const expiresAt = dateValue(session?.expiresAt);
  const createdAt = dateValue(session?.createdAt);
  const updatedAt = dateValue(session?.updatedAt);
  if (
    !session ||
    typeof session.id !== "string" ||
    typeof session.userId !== "string" ||
    typeof session.token !== "string" ||
    !expiresAt ||
    !createdAt ||
    !updatedAt ||
    !isOptionalString(session.ipAddress) ||
    !isOptionalString(session.userAgent)
  ) {
    return null;
  }

  return {
    id: session.id,
    userId: session.userId,
    token: session.token,
    expiresAt,
    ipAddress: optionalString(session.ipAddress),
    userAgent: optionalString(session.userAgent),
    createdAt,
    updatedAt,
  };
}

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function isOptionalString(value: unknown): boolean {
  return value === null || value === undefined || typeof value === "string";
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function dateValue(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value !== "string" && typeof value !== "number") return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function nullableDateValue(value: unknown): Date | null | undefined {
  if (value === null || value === undefined) return null;
  return dateValue(value) ?? undefined;
}

function isUserRole(value: unknown): value is AuthUser["role"] {
  return value === "user" || value === "donor" || value === "moderator" || value === "admin";
}

function isSubscriptionTier(value: unknown): value is AuthUser["subscriptionTier"] {
  return value === "free" || value === "tier2" || value === "tier3" || value === "tier4";
}
