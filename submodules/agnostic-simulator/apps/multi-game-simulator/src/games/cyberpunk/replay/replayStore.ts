import { gzipSync, unzipSync } from "fflate";

const DB_NAME = "cyberpunk-replays";
const DB_VERSION = 2;
const STORE_NAME = "replays";
const META_STORE_NAME = "replayMeta";
const TTL_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_IMPORT_BYTES = 25 * 1024 * 1024;
const MAX_REPLAY_JSON_BYTES = 25 * 1024 * 1024;
const SAFE_GAME_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export interface ReplayPlayerMeta {
  id: string;
  displayName: string | null;
  username: string | null;
}

export interface SavedReplayLegendSummary {
  name: string;
  ram: number | null;
  color: string | null;
}

export interface SavedReplayPlayerGameInfo {
  playerId: string;
  seat: 1 | 2;
  displayName: string | null;
  username: string | null;
  deckName?: string;
  deckListId?: string;
  deckColors: string[];
  totalRam: number;
  legends: SavedReplayLegendSummary[];
  final: {
    gigs?: number;
    streetCred?: number;
    eddies?: number;
  };
}

export interface SavedReplayGameInfo {
  gameSlug: "cyberpunk";
  viewerPlayerId?: string;
  players: [SavedReplayPlayerGameInfo, SavedReplayPlayerGameInfo];
  match: {
    winnerId?: string;
    endReason?: string;
    durationMs?: number;
    totalTurns: number;
    totalMoves: number;
    matchType?: string;
  };
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
  durationMs?: number;
  matchType?: string;
  endReason?: string;
  players?: [ReplayPlayerMeta, ReplayPlayerMeta];
  viewerPlayerId?: string;
  gameInfo?: SavedReplayGameInfo;
  firstPlayerId?: string;
  data: ArrayBuffer;
}

export type SavedReplayMeta = Omit<SavedReplay, "data">;

export class ReplayStorageQuotaError extends Error {
  constructor(cause: unknown) {
    super("Browser storage is full. Delete older saved replays and try again.");
    this.name = "ReplayStorageQuotaError";
    this.cause = cause;
  }
}

export class ReplayImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReplayImportError";
  }
}

interface ReplayForSave {
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
    analytics?: unknown;
  };
}

interface ReplayForImport extends ReplayForSave {
  gameType: string;
  steps?: Array<{ acceptedMove: { turnNumber: number; actorId: string } }>;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "gameId" });
      }
      if (!db.objectStoreNames.contains(META_STORE_NAME)) {
        const metaStore = db.createObjectStore(META_STORE_NAME, { keyPath: "gameId" });
        const transaction = request.transaction;
        if (transaction && db.objectStoreNames.contains(STORE_NAME)) {
          const replayStore = transaction.objectStore(STORE_NAME);
          const cursorRequest = replayStore.openCursor();
          cursorRequest.onsuccess = () => {
            const cursor = cursorRequest.result;
            if (!cursor) return;
            metaStore.put(toSavedReplayMeta(cursor.value as SavedReplay));
            cursor.continue();
          };
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txStore(db: IDBDatabase, mode: IDBTransactionMode): IDBObjectStore {
  return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
}

function txReplayStores(
  db: IDBDatabase,
  mode: IDBTransactionMode,
): { replays: IDBObjectStore; metadata: IDBObjectStore } {
  const transaction = db.transaction([STORE_NAME, META_STORE_NAME], mode);
  return {
    replays: transaction.objectStore(STORE_NAME),
    metadata: transaction.objectStore(META_STORE_NAME),
  };
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function isReplayStoreAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}

export async function saveReplay(replay: SavedReplay): Promise<void> {
  const db = await openDb();
  try {
    await purgeExpiredReplays(db);
    const { replays, metadata } = txReplayStores(db, "readwrite");
    try {
      await requestToPromise(replays.put(replay));
      await requestToPromise(metadata.put(toSavedReplayMeta(replay)));
    } catch (error) {
      if (isQuotaExceededError(error)) {
        throw new ReplayStorageQuotaError(error);
      }
      throw error;
    }
  } finally {
    db.close();
  }
}

export function isQuotaExceededError(error: unknown): boolean {
  if (error instanceof DOMException) {
    return error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED";
  }
  if (error instanceof Error) {
    return error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED";
  }
  return false;
}

export async function listSavedReplays(): Promise<SavedReplayMeta[]> {
  const db = await openDb();
  try {
    const store = db.transaction(META_STORE_NAME, "readonly").objectStore(META_STORE_NAME);
    const all = (await requestToPromise(store.getAll())) as SavedReplayMeta[];
    const now = Date.now();
    return all.filter((entry) => entry.expiresAt > now).sort((a, b) => b.savedAt - a.savedAt);
  } finally {
    db.close();
  }
}

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

export async function deleteReplay(gameId: string): Promise<void> {
  const db = await openDb();
  try {
    const { replays, metadata } = txReplayStores(db, "readwrite");
    await requestToPromise(replays.delete(gameId));
    await requestToPromise(metadata.delete(gameId));
  } finally {
    db.close();
  }
}

export async function purgeExpiredReplays(existingDb?: IDBDatabase): Promise<number> {
  const db = existingDb ?? (await openDb());
  const shouldClose = !existingDb;
  try {
    const { replays, metadata } = txReplayStores(db, "readwrite");
    const all = (await requestToPromise(metadata.getAll())) as SavedReplayMeta[];
    const now = Date.now();
    const expired = all.filter((entry) => entry.expiresAt <= now);
    for (const entry of expired) {
      await requestToPromise(replays.delete(entry.gameId));
      await requestToPromise(metadata.delete(entry.gameId));
    }
    return expired.length;
  } finally {
    if (shouldClose) {
      db.close();
    }
  }
}

export async function saveReplayFromApi(
  gameId: string,
  fetchBlob: (gameId: string) => Promise<ArrayBuffer>,
  decompressBlob: (compressed: ArrayBuffer) => Promise<ReplayForSave>,
  viewerPlayerId?: string,
): Promise<void> {
  const compressed = await fetchBlob(gameId);
  const data = await decompressBlob(compressed);
  await saveReplay(buildSavedReplay(data, compressed, Date.now(), viewerPlayerId));
}

export async function importReplayArchive(
  file: File,
  saveLocalReplay: (replay: SavedReplay) => Promise<void> = saveReplay,
): Promise<string> {
  if (!file.name.toLowerCase().endsWith(".zip")) {
    throw new ReplayImportError("Please select a .zip replay file.");
  }
  if (file.size > MAX_IMPORT_BYTES) {
    throw new ReplayImportError("Replay ZIP is too large to import.");
  }

  const raw = readReplayJson(new Uint8Array(await file.arrayBuffer()));
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    throw new ReplayImportError("replay.json is not valid JSON.");
  }

  const data = validateReplayData(parsed);
  await saveLocalReplay(buildSavedReplay(data, copyToArrayBuffer(gzipSync(raw)), Date.now()));
  return data.gameId;
}

export function buildSavedReplay(
  data: ReplayForSave,
  compressed: ArrayBuffer,
  savedAt: number,
  viewerPlayerId?: string,
): SavedReplay {
  const firstPlayerId = data.steps?.find((step) => step.acceptedMove.turnNumber === 1)?.acceptedMove
    .actorId;
  const gameInfo = buildCyberpunkGameInfo(data.metadata.analytics, viewerPlayerId);

  return {
    gameId: data.gameId,
    matchId: data.matchId,
    savedAt,
    expiresAt: savedAt + TTL_MS,
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
    viewerPlayerId,
    gameInfo,
    firstPlayerId,
    data: compressed,
  };
}

export function toSavedReplayMeta(replay: SavedReplay): SavedReplayMeta {
  const { data: _data, ...meta } = replay;
  return meta;
}

function readReplayJson(zipBytes: Uint8Array): Uint8Array {
  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(zipBytes);
  } catch {
    throw new ReplayImportError("Replay ZIP is corrupt or unsupported.");
  }

  const replayEntry = Object.entries(entries).find(
    ([name]) => name === "replay.json" || name.endsWith("/replay.json"),
  );
  if (!replayEntry) {
    throw new ReplayImportError('ZIP does not contain "replay.json".');
  }

  const raw = replayEntry[1];
  if (raw.byteLength > MAX_REPLAY_JSON_BYTES) {
    throw new ReplayImportError("Replay data is too large to import.");
  }
  return raw;
}

function validateReplayData(value: unknown): ReplayForImport {
  if (!isRecord(value)) {
    throw new ReplayImportError("replay.json is missing required fields.");
  }

  const data = value as Partial<ReplayForImport>;
  if (
    typeof data.gameId !== "string" ||
    typeof data.matchId !== "string" ||
    !Array.isArray(data.playerIds) ||
    data.playerIds.length !== 2 ||
    data.playerIds.some((id) => typeof id !== "string" || id.length === 0) ||
    data.playerIds[0] === data.playerIds[1] ||
    !isRecord(data.metadata)
  ) {
    throw new ReplayImportError("replay.json is missing required fields.");
  }

  if (!SAFE_GAME_ID_PATTERN.test(data.gameId)) {
    throw new ReplayImportError("Invalid gameId format in replay file.");
  }
  if (data.gameType !== "cyberpunk") {
    throw new ReplayImportError("This replay is not a Cyberpunk replay.");
  }
  if (
    typeof data.metadata.totalMoves !== "number" ||
    typeof data.metadata.totalTurns !== "number" ||
    typeof data.metadata.createdAt !== "string" ||
    typeof data.metadata.completedAt !== "string"
  ) {
    throw new ReplayImportError("replay.json metadata is invalid.");
  }
  if (
    data.steps !== undefined &&
    (!Array.isArray(data.steps) ||
      data.steps.some(
        (step) =>
          !isRecord(step) ||
          !isRecord(step.acceptedMove) ||
          typeof step.acceptedMove.turnNumber !== "number" ||
          typeof step.acceptedMove.actorId !== "string",
      ))
  ) {
    throw new ReplayImportError("replay.json steps are invalid.");
  }

  return data as ReplayForImport;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function copyToArrayBuffer(input: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(input.byteLength);
  copy.set(input);
  return copy.buffer;
}

export function buildCyberpunkGameInfo(
  analytics: unknown,
  viewerPlayerId?: string,
): SavedReplayGameInfo | undefined {
  if (
    !isRecord(analytics) ||
    analytics.gameSlug !== "cyberpunk" ||
    !Array.isArray(analytics.players)
  ) {
    return undefined;
  }
  const analyticsPlayers = analytics.players;
  if (analyticsPlayers.length !== 2) return undefined;

  const summary = isRecord(analytics.summary) ? analytics.summary : {};
  const dimensions = isRecord(analytics.dimensions) ? analytics.dimensions : {};
  const players = analyticsPlayers.map((player): SavedReplayPlayerGameInfo | null => {
    if (!isRecord(player) || typeof player.playerId !== "string") return null;
    const cardEvents = isRecord(player.cardEvents) ? player.cardEvents : {};
    const cards = Object.values(cardEvents).filter(isRecord);
    const totalRam = cards.reduce((sum, card) => {
      const ram = typeof card.ram === "number" ? card.ram : 0;
      const copies = typeof card.copiesInDeck === "number" ? card.copiesInDeck : 0;
      return sum + ram * copies;
    }, 0);
    const legends = cards
      .filter((card) => card.type === "legend")
      .map((card) => ({
        name: typeof card.displayName === "string" ? card.displayName : "Unknown legend",
        ram: typeof card.ram === "number" ? card.ram : null,
        color: typeof card.color === "string" ? card.color : null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const final = isRecord(player.final) ? player.final : {};
    return {
      playerId: player.playerId,
      seat: player.seat === 2 ? 2 : 1,
      displayName: typeof player.displayName === "string" ? player.displayName : null,
      username: typeof player.username === "string" ? player.username : null,
      deckName:
        typeof player.deckName === "string" && player.deckName.length > 0
          ? player.deckName
          : undefined,
      deckListId:
        typeof player.deckListId === "string" && player.deckListId.length > 0
          ? player.deckListId
          : undefined,
      deckColors: Array.isArray(player.deckColors)
        ? player.deckColors.filter((color): color is string => typeof color === "string")
        : [],
      totalRam,
      legends,
      final: {
        gigs: typeof final.gigs === "number" ? final.gigs : undefined,
        streetCred: typeof final.streetCred === "number" ? final.streetCred : undefined,
        eddies: typeof final.eddies === "number" ? final.eddies : undefined,
      },
    };
  });

  if (!players[0] || !players[1]) return undefined;
  return {
    gameSlug: "cyberpunk",
    viewerPlayerId,
    players: [players[0], players[1]],
    match: {
      winnerId: typeof summary.winnerId === "string" ? summary.winnerId : undefined,
      endReason: typeof summary.endReason === "string" ? summary.endReason : undefined,
      durationMs: typeof summary.durationMs === "number" ? summary.durationMs : undefined,
      totalTurns: typeof summary.totalTurns === "number" ? summary.totalTurns : 0,
      totalMoves: typeof summary.totalMoves === "number" ? summary.totalMoves : 0,
      matchType: typeof dimensions.matchType === "string" ? dimensions.matchType : undefined,
    },
  };
}
