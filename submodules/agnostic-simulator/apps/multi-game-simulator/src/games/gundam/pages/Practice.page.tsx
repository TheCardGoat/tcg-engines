import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { playUrl } from "../../../runtime/gameRuntimeApi";
import {
  gundamDeckToHistoric,
  resolveGundamPracticePayload,
  type GundamPracticePayload,
} from "../src/engine/practice/deckPayload.ts";
import { getMatchmakingReturnUrl } from "../src/engine/live/matchContext.ts";
import { gundamRuntimeRequestHeaders } from "../src/engine/live/runtimeHeaders.ts";

const GUNDAM_SIMULATOR_BASE_PATH = "/gundam/simulator";

export function buildGundamSimulatorLiveMatchPath(
  matchId: string,
  gameId: string,
  queryString: string,
): string {
  return `${GUNDAM_SIMULATOR_BASE_PATH}/matches/${encodeURIComponent(matchId)}/games/${encodeURIComponent(
    gameId,
  )}?${queryString}`;
}

/**
 * `/practice` — entry point the web matchmaking page lands on when
 * the user clicks "Open practice" on `/gundam/matchmaking`.
 *
 * Flow:
 *   1) POST `/v1/games/gundam/play/quick-match` with
 *      `authority: server`, both seats using the seed-aggro starter.
 *   2) The API creates the runtime match, primes `matches` +
 *      `match_games`, and returns `{ matchId, gameId, playerId,
 *      wsTicket, authToken }`.
 *   3) Redirect to `/matches/:matchId/games/:gameId` with the ticket carried in the
 *      query string so the live-match route can connect without a
 *      second auth round trip.
 *
 * Kept dead-simple on purpose — the matchmaking page does not yet
 * support per-player deck import for Gundam. When deck-builder
 * support lands, this route grows a `?payload=` branch (mirroring
 * cyberpunk's `WebviewPracticePage`) that decodes a base64-url
 * matchmaking payload into the bot/player decks.
 */
export function PracticePage() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<readonly string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setDetails([]);
    const resolved = resolveGundamPracticePayload(search);
    if (!resolved.ok) {
      setError(resolved.error.message);
      setDetails(resolved.error.details);
      return () => {
        cancelled = true;
      };
    }
    launchServerPractice(resolved.payload)
      .then((res) => {
        if (cancelled) return;
        const params = new URLSearchParams({
          ticket: res.wsTicket ?? "",
          playerId: res.playerId,
          returnTo: getMatchmakingReturnUrl(),
        });
        if (res.authToken) params.set("authToken", res.authToken);
        void navigate(
          buildGundamSimulatorLiveMatchPath(res.matchId, res.gameId, params.toString()),
          {
            replace: true,
          },
        );
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to start practice.");
      });
    return () => {
      cancelled = true;
    };
  }, [navigate, search]);

  return (
    <main className="min-h-screen grid place-items-center text-hud-text">
      <div className="font-mono text-center space-y-3 px-6">
        <div className="text-hud-xs tracking-hud-label text-hud-text-faint">PRACTICE</div>
        {error ? (
          <>
            <div className="text-hud-lg font-bold">Couldn't start practice</div>
            <div className="text-hud-sm text-hud-text-faint max-w-md">{error}</div>
            {details.length > 0 ? (
              <ul className="mx-auto max-w-md list-disc text-left text-hud-xs text-hud-text-faint">
                {details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
            <a className="underline" href={getMatchmakingReturnUrl()}>
              Back to matchmaking
            </a>
          </>
        ) : (
          <>
            <div className="text-hud-lg font-bold">Opening server match</div>
            <div className="text-hud-sm text-hud-text-faint max-w-md">
              Creating a server-authoritative bot match.
            </div>
          </>
        )}
      </div>
    </main>
  );
}

interface QuickMatchResponse {
  object: "quick_match";
  matchId: string;
  gameId: string;
  playerId: string;
  botPlayerId: string;
  wsTicket?: string;
  authToken?: string | null;
}

async function launchServerPractice(payload: GundamPracticePayload): Promise<QuickMatchResponse> {
  const playerDeck = gundamDeckToHistoric(payload.playerDeck);
  const botDeck = gundamDeckToHistoric(payload.botDeck);
  const response = await fetch(playUrl("gundam", "/quick-match"), {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json", ...gundamRuntimeRequestHeaders() },
    body: JSON.stringify({
      gameType: "gundam",
      authority: "server",
      playerDeck,
      botDeck,
      botStrategyId: payload.botStrategyId,
      deckListId: `${payload.playerDeckListId}_${Date.now()}`,
      botDeckListId: payload.botDeckListId,
    }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body && typeof body === "object" && "message" in body && typeof body.message === "string"
        ? body.message
        : `Quick match request failed (${response.status}).`;
    throw new Error(message);
  }
  const body = (await response.json()) as QuickMatchResponse;
  if (body.object !== "quick_match" || !body.matchId || !body.gameId || !body.playerId) {
    throw new Error("Quick match response did not include a playable match.");
  }
  if (!body.wsTicket && !body.authToken) {
    throw new Error("Quick match response did not include a gateway ticket.");
  }
  return body;
}
