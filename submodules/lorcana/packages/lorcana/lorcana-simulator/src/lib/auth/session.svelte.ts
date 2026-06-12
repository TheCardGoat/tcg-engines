/**
 * Reactive auth session state for the Lorcana Simulator.
 *
 * Uses Svelte 5 runes for reactive state management.
 * Call `fetchSession()` on mount to check for an existing session cookie.
 *
 * The Better Auth session is the single source of truth for the current user.
 * Custom columns such as `displayUsername` ride on the session payload via
 * `user.additionalFields` configured in apps/api/src/auth/auth.ts. After a
 * profile save, `AccountSettingsDialog` calls `patchUser()` for an optimistic
 * update; the next `fetchSession()` round-trip returns the canonical value.
 */

import type { AuthUser, AuthSession } from "@tcg/shared/auth";
import { authClient } from "./client.js";
import { trackEvent, setUserProperties } from "$lib/analytics/analytics.js";

let user = $state<AuthUser | null>(null);
let session = $state<AuthSession | null>(null);
let isLoading = $state(true);

async function fetchSession(
  options: { signInMethod?: "discord" | "email" | "metafy" } = {},
): Promise<void> {
  const wasAuthenticated = user !== null;
  isLoading = true;
  try {
    const result = await authClient.getSession();
    if (result.data?.user && result.data?.session) {
      // The client can't infer API-side `user.additionalFields`; the server
      // adds displayUsername/username/subscriptionTier/subscriptionExpiresAt.
      user = result.data.user as unknown as AuthUser;
      session = result.data.session as unknown as AuthSession;

      if (!wasAuthenticated) {
        trackEvent("auth_sign_in_complete", { method: options.signInMethod ?? "discord" });
      }
      setUserProperties({ auth_state: "authenticated" });
    } else {
      user = null;
      session = null;
      setUserProperties({ auth_state: "anonymous" });
    }
  } catch (error) {
    console.error("Failed to fetch session:", error);
    user = null;
    session = null;
  } finally {
    isLoading = false;
  }
}

/**
 * Optimistically patch specific fields on the current user without a full session refresh.
 * Call this immediately after a successful profile save so the UI reflects the change
 * right away, without waiting for the next fetchSession() round-trip.
 */
function patchUser(updates: Partial<AuthUser>): void {
  if (user) {
    user = { ...user, ...updates };
  }
}

/**
 * Sign in with Discord OAuth.
 * Redirects the user to Discord for authentication.
 *
 * callbackPath must be an app path (e.g. `/matchmaking`). Better Auth stores this in OAuth
 * state and redirects the browser there after the callback — it must be an absolute URL on
 * the simulator origin, not a bare path (which would resolve on the API host).
 */
interface DiscordSignInOptions {
  callbackPath?: string;
  joinGuild?: boolean;
}

interface DevEmailPasswordAuthInput {
  email: string;
  password: string;
  name?: string;
}

export const DEV_AGENT_AUTH_DEFAULTS = {
  name: "AI Agent",
  email: "ai-agent@tcg.localhost",
  password: "ai-agent-password",
} as const;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isDefaultDevAgentAuthInput(input: DevEmailPasswordAuthInput): boolean {
  return (
    normalizeEmail(input.email) === DEV_AGENT_AUTH_DEFAULTS.email &&
    input.password === DEV_AGENT_AUTH_DEFAULTS.password
  );
}

async function signInWithDiscord(options: DiscordSignInOptions = {}): Promise<void> {
  trackEvent("auth_sign_in_start", { method: "discord" });
  const { callbackPath = "/matchmaking", joinGuild = false } = options;
  const path = callbackPath.startsWith("/") ? callbackPath : `/${callbackPath}`;

  if (typeof window === "undefined") {
    throw new Error("signInWithDiscord must be called in the browser");
  }

  const callbackURL = new URL(path, window.location.origin);
  const errorCallbackURL = new URL("/sign-in", window.location.origin).toString();

  if (joinGuild) {
    const joinGuildNonce = window.crypto.randomUUID();
    window.sessionStorage.setItem("discord-join-guild-nonce", joinGuildNonce);
    callbackURL.searchParams.set("join_guild", "true");
    callbackURL.searchParams.set("join_guild_nonce", joinGuildNonce);
  }

  await authClient.signIn.social({
    provider: "discord",
    callbackURL: callbackURL.toString(),
    errorCallbackURL,
    scopes: joinGuild ? ["identify", "email", "guilds.join"] : ["identify", "email"],
  });
}

/**
 * Sign in with Metafy OAuth (generic OAuth2 provider configured on the API).
 * Redirects the user to Metafy for authentication.
 */
async function signInWithMetafy(callbackPath = "/matchmaking"): Promise<void> {
  trackEvent("auth_sign_in_start", { method: "metafy" });
  const path = callbackPath.startsWith("/") ? callbackPath : `/${callbackPath}`;

  if (typeof window === "undefined") {
    throw new Error("signInWithMetafy must be called in the browser");
  }

  const callbackURL = new URL(path, window.location.origin).toString();
  const errorCallbackURL = new URL("/sign-in", window.location.origin).toString();

  const result = await authClient.signIn.oauth2({
    providerId: "metafy",
    callbackURL,
    errorCallbackURL,
  });

  // The Better Auth fetch hook performs the redirect automatically when the
  // server response includes { url, redirect: true }. If we reach this point
  // the server did not return a redirect — usually because the Metafy provider
  // is not registered server-side (missing AUTH_METAFY_CLIENT_ID /
  // AUTH_METAFY_CLIENT_SECRET). Surface the error so the user sees something.
  if (result.error) {
    throw new Error(
      result.error.message ||
        `Metafy sign-in failed (${result.error.status ?? "unknown"} ${result.error.statusText ?? ""}).`,
    );
  }
}

async function signInWithEmail(input: DevEmailPasswordAuthInput): Promise<void> {
  const result = await authClient.signIn.email({
    email: normalizeEmail(input.email),
    password: input.password,
  });

  if (result.error) {
    throw new Error(result.error.message || "Email sign-in failed.");
  }

  await fetchSession({ signInMethod: "email" });
}

async function signUpWithEmail(input: DevEmailPasswordAuthInput): Promise<void> {
  const result = await authClient.signUp.email({
    email: normalizeEmail(input.email),
    password: input.password,
    name: input.name?.trim() || normalizeEmail(input.email),
  });

  if (result.error) {
    throw new Error(result.error.message || "Email sign-up failed.");
  }

  await fetchSession({ signInMethod: "email" });
}

async function signInOrCreateDefaultDevAgent(input: DevEmailPasswordAuthInput): Promise<void> {
  if (!import.meta.env.DEV || !isDefaultDevAgentAuthInput(input)) {
    await signInWithEmail(input);
    return;
  }

  const signInResult = await authClient.signIn.email({
    email: DEV_AGENT_AUTH_DEFAULTS.email,
    password: DEV_AGENT_AUTH_DEFAULTS.password,
  });

  if (!signInResult.error) {
    await fetchSession({ signInMethod: "email" });
    return;
  }

  const signUpResult = await authClient.signUp.email({
    email: DEV_AGENT_AUTH_DEFAULTS.email,
    password: DEV_AGENT_AUTH_DEFAULTS.password,
    name: input.name?.trim() || DEV_AGENT_AUTH_DEFAULTS.name,
  });

  if (!signUpResult.error) {
    await fetchSession({ signInMethod: "email" });
    return;
  }

  const retryResult = await authClient.signIn.email({
    email: DEV_AGENT_AUTH_DEFAULTS.email,
    password: DEV_AGENT_AUTH_DEFAULTS.password,
  });

  if (retryResult.error) {
    throw new Error(
      retryResult.error.message ||
        signUpResult.error.message ||
        signInResult.error.message ||
        "Default dev agent sign-in failed.",
    );
  }

  await fetchSession({ signInMethod: "email" });
}

/**
 * Sign out and clear session state.
 */
async function signOut(): Promise<void> {
  trackEvent("auth_sign_out");
  setUserProperties({ auth_state: "anonymous" });
  try {
    await authClient.signOut();
  } finally {
    user = null;
    session = null;
  }
}

/**
 * Hydrate session state from server-provided data (via +layout.server.ts).
 * Avoids the client-side HTTP round-trip to /api/auth/get-session.
 */
function hydrateFromServer(serverUser: AuthUser | null, serverSession: AuthSession | null): void {
  if (serverUser && serverSession) {
    user = serverUser;
    session = serverSession;
  } else {
    user = null;
    session = null;
  }
  isLoading = false;
}

export const authSession = {
  get user() {
    return user;
  },
  get session() {
    return session;
  },
  get isLoading() {
    return isLoading;
  },
  get isAuthenticated() {
    return user !== null;
  },
  fetchSession,
  patchUser,
  hydrateFromServer,
  signInWithDiscord,
  signInWithMetafy,
  signInWithEmail,
  signUpWithEmail,
  signInOrCreateDefaultDevAgent,
  signOut,
};
