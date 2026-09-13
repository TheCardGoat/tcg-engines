import {
  createAuthSessionStore,
  type AuthClientSessionValue,
  type AuthStoreState,
} from "@tcg/simulator-runtime/auth";
import { useEffect, useState } from "react";
import { getAuthBaseUrl } from "./config";
import type { AuthSession, AuthUser, SessionResult } from "./platform-session";

export type AuthData = SessionResult;
export type CyberpunkAuthStoreState = AuthStoreState<AuthData>;

async function getCanonicalSession(): Promise<AuthClientSessionValue<AuthData>> {
  try {
    const response = await fetch(`${getAuthBaseUrl()}/v1/auth/session`, {
      credentials: "include",
    });
    if (!response.ok) {
      return { data: null, isPending: false, error: { message: "Auth session request failed." } };
    }
    const parsed = parseCanonicalSession(await response.json());
    return parsed
      ? { data: parsed, isPending: false, error: null }
      : { data: null, isPending: false, error: null };
  } catch {
    return { data: null, isPending: false, error: { message: "Auth session request failed." } };
  }
}

function parseCanonicalSession(value: unknown): SessionResult | null {
  const root = objectValue(value);
  const user = normalizeUser(root?.user);
  const session = normalizeSession(root?.session);
  return user && session && session.userId === user.id ? { user, session } : null;
}

function normalizeUser(value: unknown): AuthUser | null {
  const user = objectValue(value);
  const createdAt = dateValue(user?.createdAt);
  const updatedAt = dateValue(user?.updatedAt);
  if (
    !user ||
    typeof user.id !== "string" ||
    typeof user.name !== "string" ||
    typeof user.emailVerified !== "boolean" ||
    !isUserRole(user.role) ||
    !isSubscriptionTier(user.subscriptionTier) ||
    !createdAt ||
    !updatedAt
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
    subscriptionExpiresAt: nullableDate(user.subscriptionExpiresAt),
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
    !updatedAt
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

function optionalString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function dateValue(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value !== "string" && typeof value !== "number") return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function nullableDate(value: unknown): Date | null {
  return value === null || value === undefined ? null : dateValue(value);
}

function isUserRole(value: unknown): value is AuthUser["role"] {
  return value === "user" || value === "donor" || value === "moderator" || value === "admin";
}

function isSubscriptionTier(value: unknown): value is AuthUser["subscriptionTier"] {
  return value === "free" || value === "tier2" || value === "tier3" || value === "tier4";
}

export const platformAuthClient = {
  useSession(): AuthClientSessionValue<AuthData> {
    const [value, setValue] = useState<AuthClientSessionValue<AuthData>>({
      data: null,
      isPending: true,
      error: null,
    });
    useEffect(() => {
      let active = true;
      void getCanonicalSession().then((next) => {
        if (active) setValue(next);
      });
      return () => {
        active = false;
      };
    }, []);
    return value;
  },
  async getSession(): Promise<AuthClientSessionValue<AuthData>> {
    return getCanonicalSession();
  },
};

export const {
  getAuthSnapshot,
  subscribeAuthStore,
  useAuthStore,
  hydrateAuthStoreFromClientSession,
  refreshAuthSession,
  primeAuthSession,
  toAuthStoreState,
} = createAuthSessionStore<AuthData>(platformAuthClient);
