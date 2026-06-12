import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { useBoardProjection, useGundamGame, useViewerId } from "../../game/index.ts";
import { MatchOverviewModal } from "../ui/MatchOverviewModal.tsx";
import type { MatchResult, PlayerRecap } from "../ui/MatchOverviewModal.tsx";
import { countActiveResources, resolveOpponentId, zoneCount } from "./mappers.ts";

const NOOP = () => {};
const REPLAY_DB_NAME = "gundam-replays";
const REPLAY_STORE_NAME = "replays";

function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "—";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function MatchOverviewModalContainer() {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const { adapter } = useGundamGame();
  const [dismissed, setDismissed] = useState(false);
  const [replayStatus, setReplayStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const params = useParams<{ matchId?: string }>();
  const [search] = useSearchParams();
  const gameId = search.get("gameId");
  const matchId = params.matchId ?? search.get("matchId");

  const gameEnded = view.status.gameEnded;

  // Reset dismissal whenever the end-state flips (e.g. new game).
  useEffect(() => {
    setDismissed(false);
  }, [gameEnded]);

  if (!gameEnded || dismissed) return null;

  const winner = view.status.winner ? String(view.status.winner) : undefined;
  const reason = view.status.winReason;
  const opponentId = resolveOpponentId(view, viewerId) ?? viewerId;

  const outcome: MatchResult["outcome"] =
    winner === String(viewerId) ? "victory" : winner ? "defeat" : "draw";

  const history = adapter.moveHistory();
  const firstTs = history[0]?.timestamp ?? 0;
  const lastTs = history[history.length - 1]?.timestamp ?? 0;
  const duration = firstTs && lastTs ? formatDuration(lastTs - firstTs) : "—";

  const result: MatchResult = {
    outcome,
    reason,
    turn: view.status.turn,
    duration,
    moves: history.length,
    self: buildRecap(view, viewerId, history),
    opponent: buildRecap(view, opponentId, history),
  };

  // After a match ends, "back to matchmaking" routes to the bare
  // `/vs-ai` URL, which the loader now resolves to the deck-picker
  // setup screen (see `app/routes/vs-ai.tsx`). No query params so
  // the picker renders fresh.
  const onBackToMatchmaking = () => {
    void navigate("/vs-ai");
  };

  const onDownloadReplay = () => {
    if (!gameId) {
      setReplayStatus("Replay is available after a hosted match.");
      return;
    }
    void downloadReplay(gameId, matchId).catch((error) => {
      console.error("[GundamPostGame] Failed to download replay:", error);
      setReplayStatus("Replay download failed.");
    });
  };

  const onSaveReplay = () => {
    if (!gameId) {
      setReplayStatus("Replay is available after a hosted match.");
      return;
    }
    void saveReplay(gameId, matchId).then(
      () => setReplayStatus("Replay saved."),
      (error) => {
        console.error("[GundamPostGame] Failed to save replay:", error);
        setReplayStatus("Replay save failed.");
      },
    );
  };

  return (
    <>
      <MatchOverviewModal
        result={result}
        onClose={() => setDismissed(true)}
        onBackToMatchmaking={onBackToMatchmaking}
        onDownloadReplay={onDownloadReplay}
        onSaveReplay={onSaveReplay}
        onReportBug={NOOP}
        onShareFeedback={NOOP}
      />
      {replayStatus ? (
        <div className="fixed bottom-20 left-1/2 z-[90] -translate-x-1/2 rounded-md bg-black/85 px-3 py-2 font-mono text-xs text-white">
          {replayStatus}
        </div>
      ) : null}
    </>
  );
}

type BoardView = ReturnType<typeof useBoardProjection>;
type MoveHistoryEntry = ReturnType<
  ReturnType<typeof useGundamGame>["adapter"]["moveHistory"]
>[number];

function buildRecap(
  view: BoardView,
  playerId: string,
  history: readonly MoveHistoryEntry[],
): PlayerRecap {
  const battleArea = view.zones.zones[`battleArea:${playerId}`];
  const units = battleArea?.cards ?? [];
  const ready = units.filter((c) => !(c.meta?.exhausted === true)).length;
  const exerted = units.length - ready;
  const resourcesTotal = zoneCount(view, "resourceArea", playerId);
  const resourcesActive = countActiveResources(view, playerId);
  const moves = history.filter((h) => String(h.playerId) === playerId).length;

  return {
    name: playerId,
    lore: zoneCount(view, "shieldArea", playerId),
    deck: zoneCount(view, "deck", playerId),
    hand: zoneCount(view, "hand", playerId),
    discard: zoneCount(view, "trash", playerId),
    resourcesUsed: resourcesTotal - resourcesActive,
    resourcesTotal,
    boardCount: units.length,
    ready,
    exerted,
    played: 0,
    resourcesPlaced: 0,
    quests: 0,
    challenges: 0,
    moves,
    abilities: 0,
  };
}

async function downloadReplay(gameId: string, matchId: string | null | undefined): Promise<void> {
  const compressed = await fetchReplayBlob(gameId);
  triggerBrowserDownload(
    new Blob([compressed], { type: "application/gzip" }),
    buildReplayFilename(gameId, matchId),
  );
}

async function saveReplay(gameId: string, matchId: string | null | undefined): Promise<void> {
  const compressed = await fetchReplayBlob(gameId);
  const db = await openReplayDb();
  try {
    const tx = db.transaction(REPLAY_STORE_NAME, "readwrite");
    const store = tx.objectStore(REPLAY_STORE_NAME);
    await requestToPromise(
      store.put({
        gameId,
        matchId: matchId ?? null,
        savedAt: Date.now(),
        sizeBytes: compressed.byteLength,
        data: compressed,
      }),
    );
  } finally {
    db.close();
  }
}

async function fetchReplayBlob(gameId: string): Promise<ArrayBuffer> {
  const response = await fetch(
    `${apiBaseUrl()}/v1/games/gundam/play/replays/${encodeURIComponent(gameId)}/data`,
    { credentials: "include" },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch replay (${response.status})`);
  }
  return response.arrayBuffer();
}

function apiBaseUrl(): string {
  const explicit = import.meta.env.VITE_API_URL?.trim();
  if (explicit) return normalizeApiBaseUrl(explicit);
  return "https://api.tcg.online";
}

function normalizeApiBaseUrl(value: string): string {
  return value.replace(/\/+$/, "").replace(/\/v1$/i, "");
}

function buildReplayFilename(gameId: string, matchId: string | null | undefined): string {
  const suffix = matchId ? `${gameId}-${matchId}` : gameId;
  return `gundam-replay-${suffix}.json.gz`;
}

function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

function openReplayDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(REPLAY_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(REPLAY_STORE_NAME)) {
        db.createObjectStore(REPLAY_STORE_NAME, { keyPath: "gameId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
