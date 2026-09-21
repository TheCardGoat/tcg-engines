const PRODUCTION_PLATFORM_ORIGIN = "https://tcg.online";
const STAGING_PLATFORM_ORIGIN = "https://staging.cardgoat.org";

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function isPlatformOrigin(origin: string): boolean {
  return origin === PRODUCTION_PLATFORM_ORIGIN || origin === STAGING_PLATFORM_ORIGIN;
}

function currentPageOrigin(
  explicit = typeof window === "undefined" ? undefined : window.location.origin,
): string | undefined {
  const raw = explicit?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw).origin;
  } catch {
    return undefined;
  }
}

function isTrustedReturnOrigin(url: URL, currentOrigin?: string): boolean {
  if (url.protocol === "http:" && isLocalHostname(url.hostname)) return true;
  const current = currentPageOrigin(currentOrigin);
  if (current && url.origin === current) return true;
  if (
    current &&
    isPlatformOrigin(current) &&
    isPlatformOrigin(url.origin) &&
    url.origin !== current
  ) {
    return false;
  }
  return isPlatformOrigin(url.origin);
}

/** Keep return navigation local/trusted and never forward session credentials. */
export function matchReturnUrl(
  gameSlug: string,
  search: string,
  currentOrigin = typeof window === "undefined" ? undefined : window.location.origin,
): string {
  const fallback = `/${gameSlug}/matchmaking`;
  const requested = new URLSearchParams(search).get("returnTo");
  if (!requested) return fallback;
  try {
    const relative = requested.startsWith("/") && !requested.startsWith("//");
    const url = new URL(requested, currentOrigin || PRODUCTION_PLATFORM_ORIGIN);
    if (!isTrustedReturnOrigin(url, currentOrigin)) return fallback;
    if (url.username || url.password) return fallback;
    for (const key of ["ticket", "authToken", "playerId", "role", "spectate"])
      url.searchParams.delete(key);
    if (relative) return `${url.pathname}${url.search}${url.hash}`;
    const current = currentPageOrigin(currentOrigin);
    if (current && isPlatformOrigin(current) && url.origin !== current) return fallback;
    return url.toString();
  } catch {
    return fallback;
  }
}

export function defaultMatchmakingUrl(
  gameSlug: string,
  envUrl?: string,
  currentOrigin = typeof window === "undefined" ? undefined : window.location.origin,
): string {
  const current = currentPageOrigin(currentOrigin);
  const rawEnv = envUrl?.trim();
  if (rawEnv) {
    try {
      const env = new URL(rawEnv);
      if (
        isLocalHostname(env.hostname) &&
        (!current || isLocalHostname(new URL(current).hostname))
      ) {
        return env.toString().replace(/\/$/, "");
      }
      if (current && env.origin === current) {
        return env.toString().replace(/\/$/, "");
      }
    } catch {
      // Ignore malformed env URLs and stay on the current host.
    }
  }
  if (current) return `${current}/${gameSlug}/matchmaking`;
  return `/${gameSlug}/matchmaking`;
}
