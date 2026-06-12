import { env } from "$env/dynamic/private";
import { getApiUrl, normalizeApiBaseUrl } from "./api";
import { validateAndNormalizePrivateApiOrigin } from "$lib/server/fetch-with-cf-utils.js";

export function getServerApiBaseUrl(): string {
  const internal = env.PRIVATE_API_URL?.trim();
  if (internal) return normalizeApiBaseUrl(validateAndNormalizePrivateApiOrigin(internal));
  return "";
}

export function getServerApiUrl(path: string): string {
  const base = getServerApiBaseUrl();
  if (!base) return getApiUrl(path);

  const withSlash = path.startsWith("/") ? path : `/${path}`;
  const withoutVersion =
    withSlash === "/v1" ? "/" : withSlash.startsWith("/v1/") ? withSlash.slice(3) : withSlash;
  return `${base}${withoutVersion}`;
}
