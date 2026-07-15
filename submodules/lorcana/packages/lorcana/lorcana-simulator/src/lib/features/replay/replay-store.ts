/**
 * Replay IndexedDB Store
 *
 * Persists compressed replay blobs locally with a 14-day TTL.
 * Expired entries are purged lazily on each save.
 */

const DB_NAME = "lorcana-replays";
const DB_VERSION = 1;
const STORE_NAME = "replays";
const TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReplayPlayerMeta {
  id: string;
  displayName: string | null;
  username: string | null;
}

export interface SavedReplay {
  gameId: string;
  matchId: string;
  savedAt: number;
  expiresAt: number;
  playerIds: [string, string];
  totalMoves: number;
  totalTurns: number;
  winnerId?: string;
  createdAt: string;
  completedAt: string;
  sizeBytes: number;
  /** Match duration in milliseconds */
  durationMs?: number;
  /** Match type: "ranked", "casual", "practice_vs_bot", "private" */
  matchType?: string;
  /** End reason: "lore_victory", "concede", etc. */
  endReason?: string;
  /** Player display info (display names, usernames) */
  players?: [ReplayPlayerMeta, ReplayPlayerMeta];
  /** Deck ink colors per player */
  deckColors?: { player1: string[]; player2: string[] };
  /** Player ID of whoever went first (on the play) */
  firstPlayerId?: string;
  /** Gzipped PersistedReplayData blob */
  data: ArrayBuffer;
}

export type SavedReplayMeta = Omit<SavedReplay, "data">;

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "gameId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txStore(db: IDBDatabase, mode: IDBTransactionMode): IDBObjectStore {
  return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function isReplayStoreAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}

/**
 * Save a replay to IndexedDB. Purges expired entries first.
 */
export async function saveReplay(replay: SavedReplay): Promise<void> {
  const db = await openDb();
  try {
    await purgeExpiredReplays(db);
    const store = txStore(db, "readwrite");
    await requestToPromise(store.put(replay));
  } finally {
    db.close();
  }
}

/**
 * List all non-expired saved replays (metadata only, no blob).
 */
export async function listSavedReplays(): Promise<SavedReplayMeta[]> {
  const db = await openDb();
  try {
    const store = txStore(db, "readonly");
    const all = (await requestToPromise(store.getAll())) as SavedReplay[];
    const now = Date.now();
    return all
      .filter((entry) => entry.expiresAt > now)
      .sort((a, b) => b.savedAt - a.savedAt)
      .map(({ data: _data, ...meta }) => meta);
  } finally {
    db.close();
  }
}

/**
 * Check if a replay is already saved.
 */
export async function isReplaySaved(gameId: string): Promise<boolean> {
  const db = await openDb();
  try {
    const store = txStore(db, "readonly");
    const entry = (await requestToPromise(store.get(gameId))) as SavedReplay | undefined;
    return !!entry && entry.expiresAt > Date.now();
  } finally {
    db.close();
  }
}

/**
 * Load the compressed replay blob for a game.
 */
export async function loadReplayData(gameId: string): Promise<ArrayBuffer | null> {
  const db = await openDb();
  try {
    const store = txStore(db, "readonly");
    const entry = (await requestToPromise(store.get(gameId))) as SavedReplay | undefined;
    if (!entry || entry.expiresAt <= Date.now()) {
      return null;
    }
    return entry.data;
  } finally {
    db.close();
  }
}

/**
 * Delete a single saved replay.
 */
export async function deleteReplay(gameId: string): Promise<void> {
  const db = await openDb();
  try {
    const store = txStore(db, "readwrite");
    await requestToPromise(store.delete(gameId));
  } finally {
    db.close();
  }
}

/**
 * Purge all expired entries. Returns the number of entries deleted.
 */
export async function purgeExpiredReplays(existingDb?: IDBDatabase): Promise<number> {
  const db = existingDb ?? (await openDb());
  const shouldClose = !existingDb;
  try {
    const store = txStore(db, "readwrite");
    const all = (await requestToPromise(store.getAll())) as SavedReplay[];
    const now = Date.now();
    const expired = all.filter((entry) => entry.expiresAt <= now);
    for (const entry of expired) {
      await requestToPromise(store.delete(entry.gameId));
    }
    return expired.length;
  } finally {
    if (shouldClose) {
      db.close();
    }
  }
}

// ---------------------------------------------------------------------------
// Migration: backfill rich metadata from blob for old IndexedDB entries
// ---------------------------------------------------------------------------

/**
 * For replays saved before the metadata enrichment, decompress the stored blob
 * and backfill player names, deck colors, duration, and firstPlayerId.
 * Returns the updated meta (persisted to IndexedDB) or the original if not needed.
 */
export async function migrateReplayMetadata(
  meta: SavedReplayMeta,
  decompressBlob: (compressed: ArrayBuffer) => Promise<{
    steps?: Array<{ acceptedMove: { turnNumber: number; actorId: string } }>;
    metadata: {
      durationMs?: number;
      endReason?: string;
      matchType?: string;
      players?: [ReplayPlayerMeta, ReplayPlayerMeta];
      deckColors?: { player1: string[]; player2: string[] };
    };
  }>,
): Promise<SavedReplayMeta> {
  // Already has player info — nothing to migrate
  if (meta.players !== undefined) return meta;

  const blob = await loadReplayData(meta.gameId);
  if (!blob) return meta;

  let data: Awaited<ReturnType<typeof decompressBlob>>;
  try {
    data = await decompressBlob(blob);
  } catch {
    return meta;
  }

  const firstPlayerId =
    meta.firstPlayerId ??
    data.steps?.find((s) => s.acceptedMove.turnNumber === 1)?.acceptedMove.actorId;

  const enriched: SavedReplay = {
    ...meta,
    durationMs: data.metadata.durationMs ?? meta.durationMs,
    matchType: data.metadata.matchType ?? meta.matchType,
    endReason: data.metadata.endReason ?? meta.endReason,
    players: data.metadata.players,
    deckColors: data.metadata.deckColors ?? meta.deckColors,
    firstPlayerId,
    data: blob,
  };

  await saveReplay(enriched);
  const { data: _data, ...enrichedMeta } = enriched;
  return enrichedMeta;
}

// ---------------------------------------------------------------------------
// High-level: fetch from API and save
// ---------------------------------------------------------------------------

/**
 * Fetch replay from the API and save it to IndexedDB.
 */
export async function saveReplayFromApi(
  gameId: string,
  fetchBlob: (gameId: string) => Promise<ArrayBuffer>,
  decompressBlob: (compressed: ArrayBuffer) => Promise<{
    gameId: string;
    matchId: string;
    playerIds: [string, string];
    steps?: Array<{ acceptedMove: { turnNumber: number; actorId: string } }>;
    metadata: {
      totalMoves: number;
      totalTurns: number;
      durationMs?: number;
      createdAt: string;
      completedAt: string;
      winnerId?: string;
      endReason?: string;
      matchType?: string;
      players?: [ReplayPlayerMeta, ReplayPlayerMeta];
      deckColors?: { player1: string[]; player2: string[] };
    };
  }>,
): Promise<void> {
  const compressed = await fetchBlob(gameId);
  const data = await decompressBlob(compressed);

  const firstPlayerId = data.steps?.find((s) => s.acceptedMove.turnNumber === 1)?.acceptedMove
    .actorId;

  await saveReplay({
    gameId: data.gameId,
    matchId: data.matchId,
    savedAt: Date.now(),
    expiresAt: Date.now() + TTL_MS,
    playerIds: data.playerIds,
    totalMoves: data.metadata.totalMoves,
    totalTurns: data.metadata.totalTurns,
    winnerId: data.metadata.winnerId,
    createdAt: data.metadata.createdAt,
    completedAt: data.metadata.completedAt,
    sizeBytes: compressed.byteLength,
    durationMs: data.metadata.durationMs,
    matchType: data.metadata.matchType,
    endReason: data.metadata.endReason,
    players: data.metadata.players,
    deckColors: data.metadata.deckColors,
    firstPlayerId,
    data: compressed,
  });
}
