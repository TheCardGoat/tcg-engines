import { useEffect, useState } from "react";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import { useSimulatorRoute } from "../../simulator/providers";
import { nextRiftboundGameHref } from "./navigation";

export function RiftboundLiveMatchLandingPage() {
  const route = useSimulatorRoute();
  const [redirectError, setRedirectError] = useState<string | null>(null);

  useEffect(() => {
    const resolution = route.matchResolution;
    if (!resolution) {
      return;
    }
    const gameId = resolution.currentGameId ?? resolution.match.gameIds[0];
    if (!gameId) {
      setRedirectError("This match does not have a game to open.");
      return;
    }
    window.location.replace(
      nextRiftboundGameHref(window.location.href, resolution.match.matchId, gameId),
    );
  }, [route.matchResolution]);

  const error = route.error ?? redirectError;
  return (
    <SimulatorRouteStatus
      title={error ? "Match unavailable" : "Opening match"}
      message={error ?? "Finding the current game in this Riftbound match."}
      action={
        error ? (
          <a className="underline" href="/riftbound/matchmaking">
            Back to private rooms
          </a>
        ) : undefined
      }
    />
  );
}
