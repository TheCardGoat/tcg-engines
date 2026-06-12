import type {
  AuthSession,
  AuthUser,
  SessionResult,
} from "../src/games/cyberpunk/auth/platform-session.js";

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
}: ResolvePlatformAuthSessionOptions): Promise<SessionResult | null> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const url = new URL(request.url);
  const res = await fetcher(sessionUrl, {
    headers: {
      cookie: cookieHeader,
      "x-forwarded-host": url.host,
      "x-forwarded-proto": url.protocol.replace(":", ""),
    },
    redirect: "manual",
  });

  if (!res.ok) {
    return null;
  }

  return parsePlatformAuthSession(await res.json());
}

export function parsePlatformAuthSession(value: unknown): SessionResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<SessionResult>;
  if (!isAuthUserLike(candidate.user) || !isAuthSessionLike(candidate.session)) {
    return null;
  }

  return {
    user: candidate.user,
    session: candidate.session,
  };
}

function normalizeAuthBaseUrl(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return fallback;
  }
  return trimmed.replace(/\/api\/auth\/?$/i, "").replace(/\/$/, "");
}

function isAuthUserLike(value: unknown): value is AuthUser {
  return Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as Partial<AuthUser>).id === "string" &&
    typeof (value as Partial<AuthUser>).email === "string" &&
    typeof (value as Partial<AuthUser>).name === "string" &&
    typeof (value as Partial<AuthUser>).emailVerified === "boolean" &&
    typeof (value as Partial<AuthUser>).role === "string" &&
    typeof (value as Partial<AuthUser>).subscriptionTier === "string",
  );
}

function isAuthSessionLike(value: unknown): value is AuthSession {
  return Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as Partial<AuthSession>).id === "string" &&
    typeof (value as Partial<AuthSession>).userId === "string" &&
    typeof (value as Partial<AuthSession>).token === "string",
  );
}
