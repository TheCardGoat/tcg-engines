export function nextRiftboundGameHref(
  currentHref: string,
  matchId: string,
  gameId: string,
): string {
  const url = new URL(currentHref);
  url.pathname = `/riftbound/simulator/matches/${encodeURIComponent(
    matchId,
  )}/games/${encodeURIComponent(gameId)}`;
  for (const key of ["playerId", "role", "spectate", "ticket", "authToken"]) {
    url.searchParams.delete(key);
  }
  return url.toString();
}
