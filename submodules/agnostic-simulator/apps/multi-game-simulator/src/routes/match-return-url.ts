/** Keep return navigation local/trusted and never forward session credentials. */
export function matchReturnUrl(gameSlug: string, search: string): string {
  const fallback = `/${gameSlug}/matchmaking`;
  const requested = new URLSearchParams(search).get("returnTo");
  if (!requested) return fallback;
  try {
    const relative = requested.startsWith("/") && !requested.startsWith("//");
    const url = new URL(requested, "https://tcg.online");
    if (
      !(
        url.origin === "https://tcg.online" ||
        (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))
      )
    )
      return fallback;
    if (url.username || url.password) return fallback;
    for (const key of ["ticket", "authToken", "playerId", "role", "spectate"])
      url.searchParams.delete(key);
    return relative ? `${url.pathname}${url.search}${url.hash}` : url.toString();
  } catch {
    return fallback;
  }
}
