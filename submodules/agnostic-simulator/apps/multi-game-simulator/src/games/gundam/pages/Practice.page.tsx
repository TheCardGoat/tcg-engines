import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { playUrl } from "../../../runtime/gameRuntimeApi";
import { seedAggro } from "../src/data/sample-decks/seed-aggro.ts";
import { getMatchmakingReturnUrl } from "../src/engine/live/matchContext.ts";

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
 *   3) Redirect to `/match/:matchId` with the ticket carried in the
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    launchServerPractice()
      .then((res) => {
        if (cancelled) return;
        const params = new URLSearchParams({
          ticket: res.wsTicket ?? "",
          gameId: res.gameId,
          playerId: res.playerId,
          returnTo: getMatchmakingReturnUrl(),
        });
        if (res.authToken) params.set("authToken", res.authToken);
        void navigate(`/match/${encodeURIComponent(res.matchId)}?${params.toString()}`, {
          replace: true,
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to start practice.");
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="min-h-screen grid place-items-center text-hud-text">
      <div className="font-mono text-center space-y-3 px-6">
        <div className="text-hud-xs tracking-hud-label text-hud-text-faint">PRACTICE</div>
        {error ? (
          <>
            <div className="text-hud-lg font-bold">Couldn't start practice</div>
            <div className="text-hud-sm text-hud-text-faint max-w-md">{error}</div>
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

async function launchServerPractice(): Promise<QuickMatchResponse> {
  const playerDeck = deckToHistoric(seedAggro);
  const botDeck = playerDeck;
  const response = await fetch(playUrl("gundam", "/quick-match"), {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      gameType: "gundam",
      authority: "server",
      playerDeck,
      botDeck,
      botStrategyId: "greedy",
      deckListId: `quick_gundam_seed-aggro_${Date.now()}`,
      botDeckListId: "seed-aggro",
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

/**
 * Collapse `seedAggro`'s `cards[] + resource{}` shape into the flat
 * `{cardPublicId, quantity}[]` the quick-match API expects. The
 * gundam server adapter classifies `R-001` as a resource at engine
 * init time (see `splitDeckByType` in
 * `gundam-server-adapter/src/gundam-engine-lifecycle.ts`), so we
 * don't have to mark the resource entries explicitly — they ride
 * along in the same array.
 */
function deckToHistoric(
  deck: typeof seedAggro,
): ReadonlyArray<{ cardPublicId: string; quantity: number }> {
  const entries: Array<{ cardPublicId: string; quantity: number }> = deck.cards.map((c) => ({
    cardPublicId: c.cardNumber,
    quantity: c.count,
  }));
  entries.push({ cardPublicId: deck.resource.cardNumber, quantity: deck.resource.count });
  return entries;
}
