import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { structuredCards } from "@tcg/cyberpunk-cards";
import type { DeckList } from "@tcg/cyberpunk-engine";
import { primeAuthSession } from "../auth/auth-store";
import {
  DEFAULT_SCENARIO,
  createPracticeAiConfig,
  createPracticeConfigFromDeckPayload,
  createPracticeEngine,
  createWebviewReadyMessage,
  getPracticeDeckFixture,
  loadPracticeMatchConfig,
  parseDeckImportMessage,
  postWebviewMessage,
  savePracticeMatchConfig,
  type CyberpunkDeckImportMessage,
  type DeckImportError,
  type PracticeMatchConfig,
} from "../engine";
import {
  cyberpunkRuntimeRequestHeaders,
  readServerRuntimeHeaders,
} from "../engine/live/runtimeHeaders";
import { CYBERPUNK_GAME_SLUG } from "../engine/live/apiOrigin";
import { playUrl } from "../../../runtime/gameRuntimeApi";
import { BoardSharedPage } from "./BoardShared.page";
import classes from "./Practice.module.css";
import { defaultMatchmakingUrl } from "../../../routes/match-return-url";
import { buildMountedHref } from "../../../routes/router-paths";

interface ActiveImport {
  requestId: string;
  hostOrigin: string | null;
  config: PracticeMatchConfig;
  warnings: string[];
}

type StartupState =
  | { status: "idle" }
  | { status: "launching"; warnings: string[] }
  | { status: "error"; message: string; warnings: string[] };

interface QuickMatchResponse {
  object: "quick_match";
  matchId: string;
  gameId: string;
  playerId: string;
  botPlayerId: string;
  wsTicket?: string;
  authToken?: string | null;
}

const cardsById = new Map(structuredCards.map((card) => [card.id, card]));

// One matchmaking launch must create exactly one server match even though the
// mount effect can re-run (React StrictMode double-invokes it in development,
// and webview hosts may reload the practice URL). Keyed by the raw URL payload,
// which is the stable launch intent: config.matchId is regenerated per parse
// and would not dedupe anything.
const hostedPracticeLaunchCache = new Map<string, Promise<QuickMatchResponse>>();

export function launchHostedPracticeForPayload(
  rawPayload: string,
  config: PracticeMatchConfig,
): Promise<QuickMatchResponse> {
  const existing = hostedPracticeLaunchCache.get(rawPayload);
  if (existing) {
    return existing;
  }
  const launch = practiceIdempotencyKey(rawPayload)
    .then((idempotencyKey) => launchHostedPractice(config, idempotencyKey))
    .catch((error: unknown) => {
      // A failed launch must be retryable; a cached rejection would pin the
      // page to the error until a full reload.
      hostedPracticeLaunchCache.delete(rawPayload);
      throw error;
    });
  hostedPracticeLaunchCache.set(rawPayload, launch);
  return launch;
}

/**
 * Stable idempotency key for one matchmaking launch intent. The quick-match
 * route reserves this key in Redis (30s lock, 5min result replay), so a
 * duplicate request — reload, retry, double effect — replays the first
 * response instead of creating a sibling in-progress match.
 */
export async function practiceIdempotencyKey(rawPayload: string): Promise<string> {
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
  // FNV-1a variants — only used where WebCrypto is unavailable.
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

export function WebviewPracticePage() {
  const [activeImport, setActiveImport] = useState<ActiveImport | null>(null);
  const [errors, setErrors] = useState<DeckImportError[]>([]);
  const [startup, setStartup] = useState<StartupState>({ status: "idle" });
  const latestImportRef = useRef<ActiveImport | null>(activeImport);
  latestImportRef.current = activeImport;

  const sendToHost = useCallback(
    (message: Parameters<typeof postWebviewMessage>[2], origin = activeImport?.hostOrigin) => {
      if (!origin || typeof window === "undefined") {
        return;
      }
      postWebviewMessage(window.parent, origin, message);
    },
    [activeImport?.hostOrigin],
  );

  const announceReady = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.parent?.postMessage(createWebviewReadyMessage(), "*");
  }, []);

  const handleImportMessage = useCallback((message: CyberpunkDeckImportMessage, origin: string) => {
    const result = createPracticeConfigFromDeckPayload(message.payload);
    if (!result.success) {
      setErrors(result.errors);
      postWebviewMessage(window.parent, origin, {
        type: "cyberpunk.deck.import.error.v1",
        requestId: message.requestId,
        errors: result.errors,
      });
      return;
    }

    savePracticeMatchConfig(result.config);
    const next = {
      requestId: message.requestId,
      hostOrigin: origin,
      config: result.config,
      warnings: result.warnings,
    };
    setErrors([]);
    setActiveImport(next);
    postWebviewMessage(window.parent, origin, {
      type: "cyberpunk.deck.import.accepted.v1",
      requestId: message.requestId,
      matchId: result.config.matchId,
      warnings: result.warnings,
    });
    postWebviewMessage(window.parent, origin, {
      type: "cyberpunk.practice.started.v1",
      requestId: message.requestId,
      matchId: result.config.matchId,
      playerDeckName: result.config.playerDeckName ?? result.config.playerDeck?.playerName ?? null,
      botStrategyId: result.config.botStrategyId,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const queryImport = loadFromQuery();
    if (queryImport) {
      setActiveImport(queryImport);
      return;
    }

    const matchmakingImport = loadMatchmakingPayloadFromQuery();
    if (matchmakingImport) {
      setStartup({ status: "launching", warnings: matchmakingImport.warnings });
      launchHostedPracticeForPayload(matchmakingImport.payload, matchmakingImport.config)
        .then((response) => {
          savePracticeMatchConfig(configForLiveMatchRedirect(matchmakingImport.config, response));
          window.location.replace(liveMatchHref(response, matchmakingImport.config.botStrategyId));
        })
        .catch((error) => {
          setStartup({
            status: "error",
            message:
              error instanceof Error ? error.message : "Unable to create a synced practice match.",
            warnings: matchmakingImport.warnings,
          });
        });
      return;
    }

    const announceReadyIfWaiting = () => {
      if (!latestImportRef.current) {
        announceReady();
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        announceReadyIfWaiting();
      }
    };
    const onMessage = (event: MessageEvent) => {
      const parsed = parseDeckImportMessage(event);
      if (!parsed.ok) {
        return;
      }
      handleImportMessage(parsed.message, event.origin);
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("focus", announceReadyIfWaiting);
    document.addEventListener("visibilitychange", onVisibilityChange);
    announceReady();
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("focus", announceReadyIfWaiting);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [announceReady, handleImportMessage]);

  const onMatchEnded = useCallback(
    (result: { winnerId: string | null; reason: string | null }) => {
      const current = latestImportRef.current;
      if (!current) {
        return;
      }
      sendToHost({
        type: "cyberpunk.practice.ended.v1",
        matchId: current.config.matchId,
        winner: result.winnerId === "p1" ? "player" : result.winnerId === "p2" ? "bot" : null,
        reason: result.reason,
      });
    },
    [sendToHost],
  );

  const board = useMemo(() => {
    if (!activeImport) {
      return null;
    }
    return (
      <BoardSharedPage
        key={activeImport.config.matchId}
        scenarioId={DEFAULT_SCENARIO}
        initialEngineBuilder={() => createPracticeEngine(activeImport.config)}
        initialAi={createPracticeAiConfig(activeImport.config)}
        initialHumanSide="player"
        initialAiMode="auto"
        initialAiSpeed="balanced"
        postGameSurface="deck-builder-practice"
        onMatchEnded={onMatchEnded}
      />
    );
  }, [activeImport, onMatchEnded]);

  if (board) {
    return board;
  }

  if (startup.status === "launching" || startup.status === "error") {
    return (
      <main className={classes.page}>
        <div className={classes.shell}>
          <header className={classes.header}>
            <p className={classes.eyebrow}>Cyberpunk · practice</p>
            <h1 className={classes.title}>
              {startup.status === "launching" ? "Opening practice match" : "Practice unavailable"}
            </h1>
            <p className={classes.lead}>
              {startup.status === "launching"
                ? "Creating a synced client-authoritative bot match."
                : startup.message}
            </p>
          </header>
          {startup.warnings.length > 0 ? (
            <section className={classes.warningPanel} aria-label="Practice deck warnings">
              <h2 className={classes.warningTitle}>Practice deck warnings</h2>
              <p className={classes.warningLead}>
                This deck does not pass constructed validation, but practice mode will still load it
                for testing.
              </p>
              <ul className={classes.warningList}>
                {startup.warnings.map((warning, index) => (
                  <li key={`${warning}-${index}`}>{warning}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </main>
    );
  }

  return (
    <main className={classes.page}>
      <div className={classes.shell}>
        <header className={classes.header}>
          <p className={classes.eyebrow}>Cyberpunk · webview</p>
          <h1 className={classes.title}>Waiting for deck</h1>
          <p className={classes.lead}>
            This view is ready to receive a Cyberpunk deck from the card database.
          </p>
        </header>
        {errors.length > 0 ? (
          <section className={classes.panel} aria-label="Deck import errors">
            {errors.map((error, index) => (
              <div key={`${error.code}-${index}`} className={classes.error} role="alert">
                {error.message}
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  );
}

function loadFromQuery(): ActiveImport | null {
  if (typeof window === "undefined") {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get("source") === "matchmaking") {
    return null;
  }
  const matchId = params.get("matchId");
  if (matchId) {
    const config = loadPracticeMatchConfig(matchId);
    return config ? { requestId: "query", hostOrigin: null, config, warnings: [] } : null;
  }
  const payload = params.get("payload");
  if (!payload) {
    return null;
  }
  try {
    const decoded = JSON.parse(base64UrlDecode(payload));
    const result = createPracticeConfigFromDeckPayload(decoded);
    if (!result.success) {
      return null;
    }
    savePracticeMatchConfig(result.config);
    return {
      requestId: "query",
      hostOrigin: null,
      config: result.config,
      warnings: result.warnings,
    };
  } catch {
    return null;
  }
}

function base64UrlDecode(value: string): string {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  return atob(padded);
}

function loadMatchmakingPayloadFromQuery(): {
  payload: string;
  config: PracticeMatchConfig;
  warnings: string[];
} | null {
  if (typeof window === "undefined") {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get("source") !== "matchmaking") {
    return null;
  }
  const payload = params.get("payload");
  if (!payload) {
    return null;
  }
  try {
    const decoded = JSON.parse(base64UrlDecode(payload));
    const result = createPracticeConfigFromDeckPayload(decoded);
    return result.success ? { payload, config: result.config, warnings: result.warnings } : null;
  } catch {
    return null;
  }
}

async function launchHostedPractice(
  config: PracticeMatchConfig,
  idempotencyKey?: string,
): Promise<QuickMatchResponse> {
  await primeAuthSession();

  // The URL payload may include a full bot deck, a bot fixture id, or only a
  // strategy. Resolve that into an explicit deck before crossing the API
  // boundary so the server match is reproducible and replayable.
  const botDeck = config.botDeck ?? getPracticeDeckFixture(config.botDeckFixtureId ?? "")?.deck;
  if (!config.playerDeck || !botDeck) {
    throw new Error("The selected practice decks could not be prepared for server play.");
  }

  const response = await fetch(playUrl(CYBERPUNK_GAME_SLUG, "/quick-match"), {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...(idempotencyKey ? { "idempotency-key": idempotencyKey } : {}),
      ...cyberpunkRuntimeRequestHeaders(),
    },
    body: JSON.stringify({
      gameType: "cyberpunk",
      authority: "server",
      playerDeck: deckToHistoricDeck(config.playerDeck),
      botDeck: deckToHistoricDeck(botDeck),
      botStrategyId: config.botStrategyId,
      deckListId: config.matchId,
      botDeckListId: config.botDeckFixtureId,
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

  logRuntimeHeaderMismatch(response, "quick-match");
  const body = (await response.json()) as QuickMatchResponse;
  if (body.object !== "quick_match" || !body.matchId || !body.gameId || !body.playerId) {
    throw new Error("Quick match response did not include a playable match.");
  }
  return body;
}

function configForLiveMatchRedirect(
  config: PracticeMatchConfig,
  response: QuickMatchResponse,
): PracticeMatchConfig {
  return {
    ...config,
    matchId: response.matchId,
    createdAt: Date.now(),
  };
}

function logRuntimeHeaderMismatch(response: Response, route: string): void {
  const server = readServerRuntimeHeaders(response);
  const client = cyberpunkRuntimeRequestHeaders();
  if (
    (server.runtime && server.runtime !== client["x-tcg-client-runtime"]) ||
    (server.engine && server.engine !== client["x-tcg-client-engine-runtime"]) ||
    (server.cards && server.cards !== client["x-tcg-client-cards-runtime"])
  ) {
    // eslint-disable-next-line no-console
    console.warn("[practice] runtime fingerprint mismatch", {
      route,
      clientRuntime: client["x-tcg-client-runtime"],
      clientEngine: client["x-tcg-client-engine-runtime"],
      clientCards: client["x-tcg-client-cards-runtime"],
      serverRuntime: server.runtime,
      serverEngine: server.engine,
      serverCards: server.cards,
    });
  }
}

function deckToHistoricDeck(deck: DeckList): Array<{ cardPublicId: string; quantity: number }> {
  // The API's game-agnostic match creator only needs card public ids and
  // quantities. Cyberpunk decks are expanded card ids, so collapse duplicate
  // copies and prefer slugs because the server adapter validates Cyberpunk by
  // slug.
  const counts = new Map<string, number>();
  for (const cardId of [...deck.legends, ...deck.mainDeck]) {
    const card = cardsById.get(cardId);
    const publicId = card?.slug ?? cardId;
    counts.set(publicId, (counts.get(publicId) ?? 0) + 1);
  }
  return [...counts].map(([cardPublicId, quantity]) => ({ cardPublicId, quantity }));
}

export function liveMatchHref(
  response: QuickMatchResponse,
  botStrategyId: string,
  basename = currentSimulatorBasename(),
): string {
  const params = new URLSearchParams();
  params.set("returnTo", matchmakingReturnUrl());
  params.set("botStrategyId", botStrategyId);
  const path = `/matches/${encodeURIComponent(response.matchId)}/games/${encodeURIComponent(
    response.gameId,
  )}`;
  return `${buildMountedHref(path, basename)}?${params.toString()}`;
}

function matchmakingReturnUrl(): string {
  return defaultMatchmakingUrl(CYBERPUNK_GAME_SLUG, import.meta.env.VITE_MATCHMAKING_URL);
}

function currentSimulatorBasename(): string {
  const productionMount = `/${CYBERPUNK_GAME_SLUG}/simulator`;
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    if (pathname === productionMount || pathname.startsWith(`${productionMount}/`)) {
      return productionMount;
    }
  }

  const configuredBase = import.meta.env.BASE_URL;
  return configuredBase && configuredBase !== "/" ? configuredBase : productionMount;
}
