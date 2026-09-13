/**
 * Session resolution is an optional SSR enhancement: a failed auth API must
 * never keep a simulator page from rendering for an anonymous visitor.
 */
export const SESSION_LOOKUP_TIMEOUT_MS = 2_000;
export const BEST_EFFORT_API_TIMEOUT_MS = 2_000;

const STATIC_ASSET_PATH_PATTERN = /\.(?:avif|css|gif|ico|jpe?g|js|map|mjs|png|svg|webp|woff2?)$/i;

/** Missing static assets still pass through SvelteKit's hooks. They do not need a session lookup. */
export function shouldResolveSession(pathname: string): boolean {
  return !STATIC_ASSET_PATH_PATTERN.test(pathname);
}

export function createSessionLookupRequestInit(
  cookie: string,
  timeoutMs = SESSION_LOOKUP_TIMEOUT_MS,
): RequestInit {
  return createBestEffortApiRequestInit({ headers: { cookie } }, timeoutMs);
}

/**
 * Use for optional API data whose absence has a local UI fallback. It respects
 * caller cancellation and also bounds a stalled upstream, so SSR cannot wait
 * indefinitely.
 */
export function createBestEffortApiRequestInit(
  init: RequestInit = {},
  timeoutMs = BEST_EFFORT_API_TIMEOUT_MS,
): RequestInit {
  return {
    ...init,
    signal: init.signal
      ? AbortSignal.any([init.signal, AbortSignal.timeout(timeoutMs)])
      : AbortSignal.timeout(timeoutMs),
  };
}
