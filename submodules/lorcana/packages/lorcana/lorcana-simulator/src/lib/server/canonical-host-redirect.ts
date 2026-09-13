const LEGACY_HOSTNAME = "new.lorcanito.com";
const CANONICAL_ORIGIN = "https://lorcanito.com";

/**
 * Returns the permanent canonical URL for requests made to the legacy
 * Lorcanito hostname. Paths and query strings remain unchanged.
 */
export function canonicalHostRedirect(url: URL): string | null {
  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (hostname !== LEGACY_HOSTNAME) return null;

  return `${CANONICAL_ORIGIN}${url.pathname}${url.search}`;
}
