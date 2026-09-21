import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { playUrl } from "../../../runtime/gameRuntimeApi";
import {
  buildGundamPracticeLiveMatchSearch,
  gundamDeckToHistoric,
  gundamDocumentCardsToHistoric,
  resolveGundamPracticePayload,
  type GundamPracticePayload,
} from "../src/engine/practice/deckPayload.ts";
import { getMatchmakingReturnUrl } from "../src/engine/live/matchContext.ts";
import { gundamRuntimeRequestHeaders } from "../src/engine/live/runtimeHeaders.ts";
import {
  createGundamWebviewReadyMessage,
  postGundamWebviewMessage,
} from "../src/engine/practice/webviewBridge.ts";
import { practiceModeFromSearch } from "../../../simulator/practiceMode.ts";

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
 *   1) Resolve the human deck document and either an inline curated opponent
 *      or an immutable saved bot-deck reference.
 *   2) POST `/v1/games/gundam/play/quick-match` with `authority: server`.
 *      Saved bot decks are authorized, validated, and snapshotted by the API.
 *   3) The API creates the runtime match, primes `matches` +
 *      `match_games`, and returns `{ matchId, gameId, playerId,
 *      wsTicket, authToken }`.
 *   4) Redirect to `/matches/:matchId/games/:gameId`; the canonical bootstrap
 *      resolves the authenticated seat and issues scoped realtime access.
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
    postGundamWebviewMessage(createGundamWebviewReadyMessage());
    if (practiceModeFromSearch(search) === "self") {
      const message =
        "Play both sides is not available for Gundam yet. Start a practice bot match instead.";
      setError(message);
      postGundamWebviewMessage({ type: "gundam.practice.error.v1", message, details: [] });
      return () => {
        cancelled = true;
      };
    }
    const resolved = resolveGundamPracticePayload(search);
    if (!resolved.ok) {
      setError(resolved.error.message);
      setDetails(resolved.error.details);
      postGundamWebviewMessage({
        type: "gundam.practice.error.v1",
        message: resolved.error.message,
        details: resolved.error.details,
      });
      return () => {
        cancelled = true;
      };
    }
    launchCachedPractice(search.toString(), resolved.payload)
      .then((res) => {
        if (cancelled) return;
        postGundamWebviewMessage({
          type: "gundam.practice.started.v1",
          matchId: res.matchId,
          gameId: res.gameId,
          warnings: resolved.payload.warnings,
        });
        const params = buildGundamPracticeLiveMatchSearch(search, getMatchmakingReturnUrl());
        void navigate(
          buildGundamSimulatorLiveMatchPath(res.matchId, res.gameId, params.toString()),
          {
            replace: true,
          },
        );
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to start practice.";
        setError(message);
        postGundamWebviewMessage({ type: "gundam.practice.error.v1", message, details: [] });
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

// One matchmaking launch must create exactly one server match even though the
// mount effect can re-run (React StrictMode double-invokes it in development,
// and webview hosts may reload the practice URL). Keyed by the raw query
// payload, which is the stable launch intent: the cancelled flag only stops
// the navigation, not an already-dispatched POST.
const practiceLaunchCache = new Map<string, Promise<QuickMatchResponse>>();

function launchCachedPractice(
  rawSearch: string,
  payload: GundamPracticePayload,
): Promise<QuickMatchResponse> {
  const existing = practiceLaunchCache.get(rawSearch);
  if (existing) {
    return existing;
  }
  const launch = launchServerPractice(rawSearch, payload).catch((error: unknown) => {
    // A failed launch must be retryable; a cached rejection would pin the
    // page to the error until a full reload.
    practiceLaunchCache.delete(rawSearch);
    throw error;
  });
  practiceLaunchCache.set(rawSearch, launch);
  return launch;
}

/**
 * Stable idempotency key for one practice launch intent. The quick-match route
 * reserves this key in Redis, so a duplicate request — reload, retry, double
 * effect — replays the first response instead of creating a sibling
 * in-progress match.
 */
async function practiceIdempotencyKey(rawPayload: string): Promise<string> {
  try {
    const digest = await globalThis.crypto?.subtle?.digest(
      "SHA-256",
      new TextEncoder().encode(rawPayload),
    );
    if (digest) {
      const hex = [...new Uint8Array(digest)]
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      return hex.slice(0, 48);
    }
  } catch {
    // Fall through to the non-crypto hash.
  }
  const pair = [0x811c9dc5, 0x01000193].map((seed) => {
    let hash = seed;
    for (let index = 0; index < rawPayload.length; index += 1) {
      hash ^= rawPayload.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
  });
  return `fnv${pair[0]}${pair[1]}${rawPayload.length.toString(16).padStart(8, "0")}`;
}

async function launchServerPractice(
  rawSearch: string,
  payload: GundamPracticePayload,
): Promise<QuickMatchResponse> {
  const playerDeck = payload.playerDocumentCards
    ? gundamDocumentCardsToHistoric(payload.playerDocumentCards)
    : gundamDeckToHistoric(payload.playerDeck, payload.playerPrintingSelections);
  const botDeckSource =
    payload.botDeckSource.kind === "inline"
      ? {
          kind: "inline" as const,
          deck: gundamDeckToHistoric(payload.botDeckSource.deck),
          deckListId: payload.botDeckSource.deckListId,
        }
      : payload.botDeckSource;
  const response = await fetch(playUrl("gundam", "/quick-match"), {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
      "idempotency-key": await practiceIdempotencyKey(rawSearch),
      ...gundamRuntimeRequestHeaders(),
    },
    body: JSON.stringify({
      gameType: "gundam",
      authority: "server",
      playerDeck,
      botDeckSource,
      botStrategyId: payload.botStrategyId,
      deckListId: `${payload.playerDeckListId}_${Date.now()}`,
      setupPresentation: payload.playerSetupPresentation,
      ...(payload.playerDeckVersionId ? { deckVersionId: payload.playerDeckVersionId } : {}),
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
  return body;
}
