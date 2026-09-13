import { useEffect, useState } from "react";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import { useSimulatorRoute } from "../../../simulator/providers";

/** Resolves a created Naruto match to its current server-authoritative game. */
export function NarutoLiveMatchLandingPage() {
  const route = useSimulatorRoute();
  const [redirectError, setRedirectError] = useState<string | null>(null);

  useEffect(() => {
    const resolution = route.matchResolution;
    if (!resolution) return;
    const gameId = resolution.currentGameId ?? resolution.match.gameIds[0];
    if (!gameId) {
      setRedirectError("This match does not have a game to open.");
      return;
    }
    window.location.replace(
      `/naruto/simulator/matches/${encodeURIComponent(resolution.match.matchId)}/games/${encodeURIComponent(gameId)}`,
    );
  }, [route.matchResolution]);

  const error = route.error ?? redirectError;
  return (
    <SimulatorRouteStatus
      title={error ? "Match unavailable" : "Opening match"}
      message={error ?? "Finding the current game in this Naruto match."}
    />
  );
}
