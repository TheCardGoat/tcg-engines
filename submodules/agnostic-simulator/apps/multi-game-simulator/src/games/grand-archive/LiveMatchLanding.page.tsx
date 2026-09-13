import { useEffect } from "react";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";

import { useSimulatorRoute } from "../../simulator/providers";

export function grandArchiveSafeRedirectSearch(search: string): string {
  const params = new URLSearchParams(search);
  for (const key of ["gameId", "playerId", "role", "spectate", "ticket", "authToken"]) {
    params.delete(key);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function GrandArchiveLiveMatchLandingPage() {
  const route = useSimulatorRoute();
  const resolution = route.matchResolution;
  const gameId = resolution?.currentGameId ?? resolution?.match.gameIds[0];

  useEffect(() => {
    if (!resolution || !gameId) return;
    window.location.replace(
      `/grand-archive/simulator/matches/${encodeURIComponent(resolution.match.matchId)}/games/${encodeURIComponent(gameId)}${grandArchiveSafeRedirectSearch(window.location.search)}`,
    );
  }, [gameId, resolution]);

  const error = route.error ?? (resolution && !gameId ? "This match has no game to open." : null);
  return (
    <SimulatorRouteStatus
      title={error ? "Match unavailable" : "Opening Grand Archive match"}
      message={error ?? "Preparing your private Grand Archive game view."}
    />
  );
}
