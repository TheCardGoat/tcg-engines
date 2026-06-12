import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  fetchLiveMatchOverview,
  getMatchmakingReturnUrl,
  resolveMatchOverviewDestination,
} from "../engine/live/matchContext";
import { CYBERPUNK_GAME_SLUG } from "../engine/live/apiOrigin";
import classes from "./Practice.module.css";

type LoadState = { status: "loading" } | { status: "error"; message: string };

export function LiveMatchLandingPage() {
  const { matchId = "" } = useParams<{ matchId: string }>();
  const location = useLocation();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setLoadState({ status: "loading" });
    fetchLiveMatchOverview(CYBERPUNK_GAME_SLUG, matchId)
      .then((overview) => {
        if (cancelled) {
          return;
        }
        window.location.replace(resolveMatchOverviewDestination(overview, location.search).href);
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to load match.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [location.search, matchId]);

  const returnUrl = getMatchmakingReturnUrl(CYBERPUNK_GAME_SLUG, location.search);
  return (
    <main className={classes.page}>
      <div className={classes.shell}>
        <header className={classes.header}>
          <p className={classes.eyebrow}>Cyberpunk · live match</p>
          <h1 className={classes.title}>
            {loadState.status === "loading" ? "Opening match" : "Match unavailable"}
          </h1>
          <p className={classes.lead}>
            {loadState.status === "loading"
              ? "Finding the current game in this Cyberpunk match."
              : loadState.message}
          </p>
          <a className={classes.backLink} href={returnUrl}>
            Return to matchmaking
          </a>
        </header>
      </div>
    </main>
  );
}
