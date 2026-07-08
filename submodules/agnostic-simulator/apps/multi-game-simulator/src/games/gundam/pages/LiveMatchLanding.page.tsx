import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import {
  fetchLiveMatchOverview,
  getMatchmakingReturnUrl,
  resolveMatchOverviewDestination,
} from "../src/engine/live/matchContext.ts";

const GUNDAM_SIMULATOR_BASE_PATH = "/gundam/simulator";

type LoadState =
  | { readonly status: "loading" }
  | { readonly status: "error"; readonly message: string };

export function LiveMatchLandingPage() {
  const { matchId = "" } = useParams<{ matchId: string }>();
  const location = useLocation();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setLoadState({ status: "loading" });
    fetchLiveMatchOverview("gundam", matchId)
      .then((overview) => {
        if (cancelled) return;
        window.location.replace(
          resolveMatchOverviewDestination(overview, location.search, GUNDAM_SIMULATOR_BASE_PATH)
            .href,
        );
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load match.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [location.search, matchId]);

  return (
    <main className="min-h-screen grid place-items-center text-hud-text">
      <div className="font-mono text-center space-y-3 px-6">
        <div className="text-hud-xs tracking-hud-label text-hud-text-faint">
          GUNDAM · LIVE MATCH
        </div>
        <div className="text-hud-lg font-bold">
          {loadState.status === "loading" ? "Opening match" : "Match unavailable"}
        </div>
        <div className="text-hud-sm text-hud-text-faint max-w-md">
          {loadState.status === "loading"
            ? "Finding the current game in this Gundam match."
            : loadState.message}
        </div>
        <a className="underline" href={getMatchmakingReturnUrl(location.search)}>
          Back to matchmaking
        </a>
      </div>
    </main>
  );
}
