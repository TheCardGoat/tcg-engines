import { normalizeAuthBaseUrl as normalizeSharedAuthBaseUrl } from "@tcg/simulator-runtime/auth";

export type AuthBaseEnv = Record<string, string | boolean | undefined>;

const PRODUCTION_AUTH_BASE_URL = "https://api.tcg.online";
const LOCAL_AUTH_BASE_URL = "http://localhost:3000";

export function normalizeAuthBaseUrl(
  apiUrl: string | undefined,
  fallback = LOCAL_AUTH_BASE_URL,
): string {
  return normalizeSharedAuthBaseUrl(apiUrl, fallback);
}

export function resolveAuthBaseUrl(env: AuthBaseEnv): string {
  const fallback = env.PROD ? PRODUCTION_AUTH_BASE_URL : LOCAL_AUTH_BASE_URL;
  return normalizeSharedAuthBaseUrl(
    typeof env.VITE_AUTH_BASE_URL === "string" ? env.VITE_AUTH_BASE_URL : undefined,
    fallback,
  );
}

export function getAuthBaseUrl(): string {
  return resolveAuthBaseUrl(import.meta.env as AuthBaseEnv);
}
