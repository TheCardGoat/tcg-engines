import {
  ReplayPlaybackV1Schema,
  type ReplayPlaybackV1,
  type ReplayTrust,
} from "@tcg/game-page-contract";

const DB_NAME = "tcg-replays";
const DB_VERSION = 1;
const STORE_NAME = "replays";
const MAX_ARCHIVE_BYTES = 25 * 1024 * 1024;
const MAX_REPLAY_BYTES = 25 * 1024 * 1024;
const LEGACY_DATABASES = [
  { name: "lorcana-replays", gameSlug: "lorcana" },
  { name: "cyberpunk-replays", gameSlug: "cyberpunk" },
  { name: "gundam-replays", gameSlug: "gundam" },
] as const;
let legacyMigration: Promise<void> | null = null;

async function decompressBytes(
  data: BlobPart,
  format: CompressionFormat,
): Promise<Uint8Array<ArrayBuffer>> {
  const stream = new Blob([data])
    .stream()
    .pipeThrough(
      new DecompressionStream(format) as unknown as ReadableWritablePair<
        Uint8Array<ArrayBuffer>,
        Uint8Array<ArrayBuffer>
      >,
    );
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export interface SavedBrowserReplay {
  gameSlug: string;
  gameId: string;
  matchId: string;
  savedAt: number;
  sizeBytes: number;
  trust: ReplayTrust;
  participants: ReplayPlaybackV1["replay"]["participants"];
  metadata: ReplayPlaybackV1["replay"]["metadata"];
  playback: ReplayPlaybackV1;
}

export type SavedBrowserReplaySummary = Omit<SavedBrowserReplay, "playback">;

export interface ReplayArchiveManifestV1 {
  format: "tcg-replay-archive";
  version: 1;
  gameSlug: string;
  gameId: string;
  matchId: string;
  exportedAt: string;
  replayFile: "replay.json";
}

export class ReplayArchiveError extends Error {}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error ?? new Error("Replay storage aborted."));
  });
}

function openReplayDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: ["gameSlug", "gameId"] });
        store.createIndex("gameSlug", "gameSlug");
        store.createIndex("savedAt", "savedAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function isBrowserReplayStorageAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}

export async function saveReplayOnDevice(
  gameSlug: string,
  playbackInput: ReplayPlaybackV1,
): Promise<SavedBrowserReplaySummary> {
  const playback = ReplayPlaybackV1Schema.parse(playbackInput);
  if (playback.replay.gameType !== gameSlug) {
    throw new Error(`Replay belongs to ${playback.replay.gameType}, not ${gameSlug}.`);
  }
  const serialized = JSON.stringify(playback);
  const saved: SavedBrowserReplay = {
    gameSlug,
    gameId: playback.replay.gameId,
    matchId: playback.replay.matchId,
    savedAt: Date.now(),
    sizeBytes: new TextEncoder().encode(serialized).byteLength,
    trust: playback.trust,
    participants: playback.replay.participants,
    metadata: playback.replay.metadata,
    playback,
  };
  const db = await openReplayDatabase();
  try {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(saved);
    await transactionToPromise(transaction);
  } finally {
    db.close();
  }
  const { playback: _playback, ...summary } = saved;
  return summary;
}

export async function loadReplayFromDevice(
  gameSlug: string,
  gameId: string,
): Promise<ReplayPlaybackV1 | null> {
  const db = await openReplayDatabase();
  try {
    const value = (await requestToPromise(
      db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get([gameSlug, gameId]),
    )) as SavedBrowserReplay | undefined;
    return value ? ReplayPlaybackV1Schema.parse(value.playback) : null;
  } finally {
    db.close();
  }
}

export async function listDeviceReplays(gameSlug?: string): Promise<SavedBrowserReplaySummary[]> {
  await migrateLegacyBrowserReplays();
  const db = await openReplayDatabase();
  try {
    const store = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME);
    const values = (await requestToPromise(
      gameSlug ? store.index("gameSlug").getAll(gameSlug) : store.getAll(),
    )) as SavedBrowserReplay[];
    return values
      .sort((left, right) => right.savedAt - left.savedAt)
      .map(({ playback: _playback, ...summary }) => summary);
  } finally {
    db.close();
  }
}

/** Copy convertible old saves into the shared store. Originals remain until the copy commits. */
export function migrateLegacyBrowserReplays(): Promise<void> {
  if (!isBrowserReplayStorageAvailable()) return Promise.resolve();
  legacyMigration ??= migrateLegacyBrowserReplaysOnce();
  return legacyMigration;
}

async function migrateLegacyBrowserReplaysOnce(): Promise<void> {
  const databases = typeof indexedDB.databases === "function" ? await indexedDB.databases() : [];
  const knownNames = new Set(
    databases.flatMap((database) => (database.name ? [database.name] : [])),
  );
  for (const legacy of LEGACY_DATABASES) {
    if (!knownNames.has(legacy.name)) continue;
    const db = await openNamedDatabase(legacy.name);
    try {
      if (!db.objectStoreNames.contains(STORE_NAME)) continue;
      const records = (await requestToPromise(
        db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll(),
      )) as Array<{ data?: ArrayBuffer }>;
      for (const record of records) {
        if (!(record.data instanceof ArrayBuffer)) continue;
        const playback = await decodeLegacyCanonicalPayload(record.data);
        if (!playback || playback.replay.gameType !== legacy.gameSlug) continue;
        await saveReplayOnDevice(legacy.gameSlug, playback);
      }
    } finally {
      db.close();
    }
  }
}

function openNamedDatabase(name: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function decodeLegacyCanonicalPayload(buffer: ArrayBuffer): Promise<ReplayPlaybackV1 | null> {
  let bytes = new Uint8Array(buffer);
  if (bytes[0] === 0x1f && bytes[1] === 0x8b && typeof DecompressionStream !== "undefined") {
    bytes = await decompressBytes(buffer, "gzip");
  }
  try {
    const parsed = ReplayPlaybackV1Schema.safeParse(JSON.parse(new TextDecoder().decode(bytes)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function deleteDeviceReplay(gameSlug: string, gameId: string): Promise<void> {
  const db = await openReplayDatabase();
  try {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete([gameSlug, gameId]);
    await transactionToPromise(transaction);
  } finally {
    db.close();
  }
}

export async function fetchAndSaveReplay(
  url: string,
  gameSlug: string,
  fetcher: typeof fetch = fetch,
): Promise<SavedBrowserReplaySummary> {
  const response = await fetcher(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch replay (${response.status}).`);
  return saveReplayOnDevice(gameSlug, ReplayPlaybackV1Schema.parse(await response.json()));
}

export async function loadReplayWithSource(params: {
  gameSlug: string;
  gameId: string;
  cloudUrl: string;
  preferredSource?: "cloud" | "device";
  fetcher?: typeof fetch;
}): Promise<{ playback: ReplayPlaybackV1; source: "cloud" | "device" }> {
  if (params.preferredSource === "device") {
    const local = await loadReplayFromDevice(params.gameSlug, params.gameId);
    if (local) return { playback: local, source: "device" };
    throw new Error("This replay is not saved on this device.");
  }
  const response = await (params.fetcher ?? fetch)(params.cloudUrl, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch replay (${response.status}).`);
  return { playback: ReplayPlaybackV1Schema.parse(await response.json()), source: "cloud" };
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const output = new Uint8Array(parts.reduce((sum, part) => sum + part.byteLength, 0));
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.byteLength;
  }
  return output;
}

function storedZip(files: Record<string, Uint8Array>): Uint8Array {
  const encoder = new TextEncoder();
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const [name, data] of Object.entries(files)) {
    const nameBytes = encoder.encode(name);
    const local = new Uint8Array(30 + nameBytes.length + data.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint32(14, crc32(data), true);
    localView.setUint32(18, data.length, true);
    localView.setUint32(22, data.length, true);
    localView.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30);
    local.set(data, 30 + nameBytes.length);
    locals.push(local);

    const central = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint32(16, crc32(data), true);
    centralView.setUint32(20, data.length, true);
    centralView.setUint32(24, data.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centrals.push(central);
    offset += local.length;
  }
  const centralOffset = offset;
  const centralSize = centrals.reduce((sum, value) => sum + value.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, centrals.length, true);
  endView.setUint16(10, centrals.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, centralOffset, true);
  return concat([...locals, ...centrals, end]);
}

export function createReplayArchive(playbackInput: ReplayPlaybackV1): Blob {
  const playback = ReplayPlaybackV1Schema.parse(playbackInput);
  const manifest: ReplayArchiveManifestV1 = {
    format: "tcg-replay-archive",
    version: 1,
    gameSlug: playback.replay.gameType,
    gameId: playback.replay.gameId,
    matchId: playback.replay.matchId,
    exportedAt: new Date().toISOString(),
    replayFile: "replay.json",
  };
  const encoder = new TextEncoder();
  const archiveBytes = storedZip({
    "manifest.json": encoder.encode(JSON.stringify(manifest, null, 2)),
    "replay.json": encoder.encode(JSON.stringify(playback, null, 2)),
  });
  const archiveBuffer = archiveBytes.buffer.slice(
    archiveBytes.byteOffset,
    archiveBytes.byteOffset + archiveBytes.byteLength,
  ) as ArrayBuffer;
  return new Blob([archiveBuffer], { type: "application/zip" });
}

export function replayArchiveFilename(playback: ReplayPlaybackV1): string {
  return `${playback.replay.gameType}-${playback.replay.gameId}.replay.zip`;
}

export function downloadReplayArchive(playback: ReplayPlaybackV1): void {
  const url = URL.createObjectURL(createReplayArchive(playback));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = replayArchiveFilename(playback);
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

function findEnd(view: DataView): number {
  for (
    let offset = view.byteLength - 22;
    offset >= Math.max(0, view.byteLength - 65_557);
    offset -= 1
  ) {
    if (view.getUint32(offset, true) === 0x06054b50) return offset;
  }
  throw new ReplayArchiveError("Not a valid replay ZIP file.");
}

async function unzipReplay(bytes: Uint8Array): Promise<Record<string, Uint8Array>> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const end = findEnd(view);
  const count = view.getUint16(end + 10, true);
  let cursor = view.getUint32(end + 16, true);
  const decoder = new TextDecoder();
  const files: Record<string, Uint8Array> = {};
  let totalUncompressedBytes = 0;
  for (let index = 0; index < count; index += 1) {
    if (view.getUint32(cursor, true) !== 0x02014b50)
      throw new ReplayArchiveError("Invalid ZIP directory.");
    const method = view.getUint16(cursor + 10, true);
    const compressedSize = view.getUint32(cursor + 20, true);
    const uncompressedSize = view.getUint32(cursor + 24, true);
    totalUncompressedBytes += uncompressedSize;
    if (uncompressedSize > MAX_REPLAY_BYTES || totalUncompressedBytes > MAX_REPLAY_BYTES) {
      throw new ReplayArchiveError("Replay ZIP expands beyond the allowed size.");
    }
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const localOffset = view.getUint32(cursor + 42, true);
    const name = decoder.decode(bytes.slice(cursor + 46, cursor + 46 + nameLength));
    const localNameLength = view.getUint16(localOffset + 26, true);
    const localExtraLength = view.getUint16(localOffset + 28, true);
    const start = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = bytes.slice(start, start + compressedSize);
    if (method === 0) files[name] = compressed;
    else if (method === 8 && typeof DecompressionStream !== "undefined") {
      files[name] = await decompressBytes(compressed, "deflate-raw");
    } else throw new ReplayArchiveError("Replay ZIP uses unsupported compression.");
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

async function decodeReplayFile(
  file: File,
): Promise<{ value: unknown; manifest: ReplayArchiveManifestV1 | null }> {
  if (file.size > MAX_ARCHIVE_BYTES) throw new ReplayArchiveError("Replay file is too large.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  let jsonBytes: Uint8Array;
  let manifest: ReplayArchiveManifestV1 | null = null;
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    const files = await unzipReplay(bytes);
    jsonBytes = files["replay.json"] ?? new Uint8Array();
    if (files["manifest.json"]) {
      try {
        const candidate = JSON.parse(new TextDecoder().decode(files["manifest.json"]));
        if (
          !candidate ||
          candidate.format !== "tcg-replay-archive" ||
          candidate.version !== 1 ||
          candidate.replayFile !== "replay.json" ||
          typeof candidate.gameSlug !== "string" ||
          typeof candidate.gameId !== "string" ||
          typeof candidate.matchId !== "string"
        ) {
          throw new Error("invalid manifest");
        }
        manifest = candidate as ReplayArchiveManifestV1;
      } catch {
        throw new ReplayArchiveError("Replay manifest is invalid.");
      }
    }
  } else if (bytes[0] === 0x1f && bytes[1] === 0x8b && typeof DecompressionStream !== "undefined") {
    jsonBytes = await decompressBytes(bytes, "gzip");
  } else jsonBytes = bytes;
  if (jsonBytes.byteLength === 0 || jsonBytes.byteLength > MAX_REPLAY_BYTES) {
    throw new ReplayArchiveError("Replay JSON is missing or too large.");
  }
  try {
    return { value: JSON.parse(new TextDecoder().decode(jsonBytes)), manifest };
  } catch {
    throw new ReplayArchiveError("Replay JSON is invalid.");
  }
}

export async function parseReplayArchive(file: File, expectedGameSlug?: string) {
  const { value, manifest } = await decodeReplayFile(file);
  const result = ReplayPlaybackV1Schema.safeParse(value);
  if (!result.success) {
    throw new ReplayArchiveError(
      "This legacy replay does not contain the complete canonical resources required for playback.",
    );
  }
  if (expectedGameSlug && result.data.replay.gameType !== expectedGameSlug) {
    throw new ReplayArchiveError(
      `Replay belongs to ${result.data.replay.gameType}, not ${expectedGameSlug}.`,
    );
  }
  if (
    manifest &&
    (manifest.gameSlug !== result.data.replay.gameType ||
      manifest.gameId !== result.data.replay.gameId ||
      manifest.matchId !== result.data.replay.matchId)
  ) {
    throw new ReplayArchiveError("Replay manifest does not match replay.json.");
  }
  const playback: ReplayPlaybackV1 = { ...result.data, trust: "player_authored_unverified" };
  return playback;
}

export async function importReplayToDevice(file: File, expectedGameSlug?: string) {
  const playback = await parseReplayArchive(file, expectedGameSlug);
  return saveReplayOnDevice(playback.replay.gameType, playback);
}
