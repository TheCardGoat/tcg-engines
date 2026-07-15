import type { AuthSession, AuthUser, SessionResult } from "@tcg/shared/auth";

export type PlatformAuthSessionStatus = "ready" | "session_missing" | "auth_parse_failed";

export type PlatformAuthSessionResult =
  | { status: "ready"; session: SessionResult }
  | {
      status: "session_missing";
      reason: "no_cookie" | "auth_endpoint_non_ok" | "fetch_failed" | "no_session";
      httpStatus?: number;
    }
  | { status: "auth_parse_failed"; reason: "malformed_payload" };

export interface ResolvePlatformAuthSessionOptions {
  request: Request;
  fetcher?: typeof fetch;
  sessionUrl?: string;
}

export function getPlatformAuthBaseUrl(): string {
  return normalizeAuthBaseUrl(
    process.env.AUTH_INTERNAL_URL ?? process.env.AUTH_BASE_URL ?? process.env.VITE_AUTH_BASE_URL,
    "https://api.tcg.online",
  );
}

export function getPlatformSessionUrl(): string {
  return `${getPlatformAuthBaseUrl()}/api/auth/get-session`;
}

export async function resolvePlatformAuthSession({
  request,
  fetcher = fetch,
  sessionUrl = getPlatformSessionUrl(),
}: ResolvePlatformAuthSessionOptions): Promise<PlatformAuthSessionResult> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    const result = { status: "session_missing", reason: "no_cookie" } as const;
    logAuthSessionResult(result);
    return result;
  }

  const url = new URL(request.url);
  let res: Response;
  try {
    res = await fetcher(sessionUrl, {
      headers: {
        cookie: cookieHeader,
        "x-forwarded-host": url.host,
        "x-forwarded-proto": url.protocol.replace(":", ""),
      },
      redirect: "manual",
    });
  } catch (error) {
    const result = { status: "session_missing", reason: "fetch_failed" } as const;
    logAuthSessionResult({
      ...result,
      error: error instanceof Error ? error.name : typeof error,
    });
    return result;
  }

  if (!res.ok) {
    const result = {
      status: "session_missing",
      reason: "auth_endpoint_non_ok",
      httpStatus: res.status,
    } as const;
    logAuthSessionResult(result);
    return result;
  }

  let rawSession: unknown;
  try {
    rawSession = await res.json();
  } catch (error) {
    const result = { status: "session_missing", reason: "no_session" } as const;
    logAuthSessionResult({
      ...result,
      error: error instanceof Error ? error.name : typeof error,
    });
    return result;
  }

  if (rawSession === null) {
    const result = { status: "session_missing", reason: "no_session" } as const;
    logAuthSessionResult(result);
    return result;
  }

  const parsed = parsePlatformAuthSession(rawSession);
  if (!parsed) {
    const result = { status: "auth_parse_failed", reason: "malformed_payload" } as const;
    logAuthSessionResult(result);
    return result;
  }

  logAuthSessionResult({
    status: "ready",
    hasUser: Boolean(parsed.user?.id),
    hasSessionToken: Boolean(parsed.session?.token),
  });
  return { status: "ready", session: parsed };
}

export function parsePlatformAuthSession(value: unknown): SessionResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<SessionResult>;
  const user = normalizeAuthUser(candidate.user);
  if (!user) {
    return null;
  }
  const session = normalizeAuthSession(candidate.session, user.id);
  if (!session) {
    return null;
  }

  return {
    user,
    session,
  };
}

function normalizeAuthBaseUrl(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return fallback;
  }
  return trimmed.replace(/\/api\/auth\/?$/i, "").replace(/\/$/, "");
}

function normalizeAuthUser(value: unknown): AuthUser | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = value as Partial<AuthUser>;
  if (typeof candidate.id !== "string" || candidate.id.length === 0) {
    return null;
  }

  return {
    id: candidate.id,
    email: typeof candidate.email === "string" ? candidate.email : "",
    name: typeof candidate.name === "string" ? candidate.name : candidate.id,
    image: optionalString(candidate.image),
    username: optionalString(candidate.username),
    displayUsername: optionalString(candidate.displayUsername),
    emailVerified: typeof candidate.emailVerified === "boolean" ? candidate.emailVerified : false,
    role: isUserRole(candidate.role) ? candidate.role : "user",
    subscriptionTier: isSubscriptionTier(candidate.subscriptionTier)
      ? candidate.subscriptionTier
      : "free",
    subscriptionExpiresAt: nullableDate(candidate.subscriptionExpiresAt),
    createdAt: normalizeDate(candidate.createdAt),
    updatedAt: normalizeDate(candidate.updatedAt),
  };
}

function normalizeAuthSession(value: unknown, fallbackUserId: string): AuthSession | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = value as Partial<AuthSession>;
  if (typeof candidate.token !== "string" || candidate.token.length === 0) {
    return null;
  }

  const userId =
    typeof candidate.userId === "string" && candidate.userId.length > 0
      ? candidate.userId
      : fallbackUserId;
  return {
    id:
      typeof candidate.id === "string" && candidate.id.length > 0
        ? candidate.id
        : `session:${userId}`,
    userId,
    token: candidate.token,
    expiresAt: normalizeDate(candidate.expiresAt),
    ipAddress: optionalString(candidate.ipAddress),
    userAgent: optionalString(candidate.userAgent),
    createdAt: normalizeDate(candidate.createdAt),
    updatedAt: normalizeDate(candidate.updatedAt),
  };
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function nullableDate(value: unknown): Date | null {
  return value === null || value === undefined ? null : normalizeDate(value);
}

function normalizeDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.valueOf())) {
      return date;
    }
  }
  return new Date(0);
}

function isUserRole(value: unknown): value is AuthUser["role"] {
  return value === "user" || value === "donor" || value === "moderator" || value === "admin";
}

function isSubscriptionTier(value: unknown): value is AuthUser["subscriptionTier"] {
  return (
    value === "free" ||
    value === "tier1" ||
    value === "tier2" ||
    value === "tier3" ||
    value === "tier4" ||
    value === "tier5" ||
    value === "tier6"
  );
}

function logAuthSessionResult(details: Record<string, unknown>): void {
  console.info("[simulator-auth] platform session bootstrap", details);
}
