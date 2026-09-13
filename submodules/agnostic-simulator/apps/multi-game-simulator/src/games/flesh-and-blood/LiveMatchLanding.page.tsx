import { useEffect } from "react";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import { useSimulatorRoute } from "../../simulator/providers";

export function FabLiveMatchLandingPage() {
  const route = useSimulatorRoute();
  const resolution = route.matchResolution;
  const gameId = resolution?.currentGameId ?? resolution?.match.gameIds[0];

  useEffect(() => {
    if (!resolution || !gameId) return;
    window.location.replace(
      `/flesh-and-blood/simulator/matches/${encodeURIComponent(resolution.match.matchId)}/games/${encodeURIComponent(gameId)}${window.location.search}`,
    );
  }, [gameId, resolution]);

  const error = route.error ?? (resolution && !gameId ? "This match has no game to open." : null);
  return (
    <SimulatorRouteStatus
      title={error ? "Match unavailable" : "Opening sideboard"}
      message={error ?? "Preparing your private Flesh and Blood card selection."}
    />
  );
}
