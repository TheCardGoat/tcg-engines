/**
 * API Configuration Service
 *
 * Normalizes PUBLIC_API_URL so API clients can reliably call /v1 endpoints.
 * If PUBLIC_API_URL is unset, requests fall back to the app's internal /api/v1 paths.
 */
import { env } from "$env/dynamic/public";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function normalizeApiBaseUrl(value?: string): string {
  if (!value) {
    return "";
  }

  const trimmed = trimTrailingSlash(value);
  return /\/v1$/i.test(trimmed) ? trimmed : `${trimmed}/v1`;
}

export function getApiBaseUrl(): string {
  return normalizeApiBaseUrl(env.PUBLIC_API_URL);
}

export function getApiUrl(path: string): string {
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  const withoutVersion =
    withSlash === "/v1" ? "/" : withSlash.startsWith("/v1/") ? withSlash.slice(3) : withSlash;

  const base = getApiBaseUrl();
  return base ? `${base}${withoutVersion}` : `/v1${withoutVersion}`;
}
