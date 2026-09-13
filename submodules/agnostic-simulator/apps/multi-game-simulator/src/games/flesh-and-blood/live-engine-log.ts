import {
  FAB_LOG_KEYS,
  FAB_LOG_KEY_CATEGORIES,
  FAB_LOG_TRANSLATION_VALUE_KEYS,
  type FabLogCategory,
  type FabLogKey,
} from "@tcg/flesh-and-blood-engine/log";
import type {
  FabPlayerLogMessage,
  FabVisiblePlayerLog,
} from "@tcg/flesh-and-blood-engine/simulator";

/**
 * Live event-log feed for FAB matches: accumulates viewer-safe engine log
 * records from gateway payloads and directly projects their authored
 * consequences once per engine batch — never per render.
 *
 * The wire carries the same record twice with different visibility: the
 * public `state_update` broadcast and the actor-composed `move_accepted`
 * reply (with that viewer's private replacements selected). Both share
 * the structural dedupe key below, so the richer viewer copy wins on
 * collision — the accumulation pattern proven by Gundam's live messages.
 */

/** One engine-log record as carried on the live wire / bootstrap history. */
export interface FabLiveEngineLogRecord {
  readonly stateVersion: number;
  readonly timestamp: number;
  readonly log: FabVisiblePlayerLog;
}

/** Bounded so a long match keeps the corpus (and re-projection) cheap. */
const FAB_LIVE_LOG_LIMIT = 512;
const FAB_LOG_KEY_SET: ReadonlySet<string> = new Set(FAB_LOG_KEYS);

function isFabLogKey(value: unknown): value is FabLogKey {
  return typeof value === "string" && FAB_LOG_KEY_SET.has(value);
}

function isFabLogCategory(value: unknown): value is FabLogCategory {
  return (
    value === "action" ||
    value === "combat" ||
    value === "ability" ||
    value === "rules" ||
    value === "system"
  );
}

function isFabPhase(value: unknown): value is FabVisiblePlayerLog["phase"] {
  return value === "start" || value === "action" || value === "end";
}

function recordKey(record: FabLiveEngineLogRecord): string {
  return [record.log.commandId, record.log.timestamp].join("|");
}

function isPlayerLogMessage(value: unknown): value is FabPlayerLogMessage {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const message = value as Record<string, unknown>;
  const key = message.key;
  const category = message.category;
  const values = message.values;
  if (!isFabLogKey(key)) return false;
  const expectedValueKeys = FAB_LOG_TRANSLATION_VALUE_KEYS[key];
  return (
    isFabLogCategory(category) &&
    category === FAB_LOG_KEY_CATEGORIES[key] &&
    typeof values === "object" &&
    values !== null &&
    !Array.isArray(values) &&
    Object.keys(values).length === expectedValueKeys.length &&
    expectedValueKeys.every((valueKey) => Object.hasOwn(values, valueKey)) &&
    (message.cardRefs === undefined ||
      (Array.isArray(message.cardRefs) &&
        message.cardRefs.every(
          (card) =>
            typeof card === "object" &&
            card !== null &&
            typeof (card as { instanceId?: unknown }).instanceId === "string" &&
            (((card as { canonicalId?: unknown }).canonicalId ?? null) === null ||
              typeof (card as { canonicalId?: unknown }).canonicalId === "string") &&
            typeof (card as { name?: unknown }).name === "string",
        )))
  );
}

const VIEWER_DETAIL_LOG_KEYS: ReadonlySet<FabLogKey> = new Set([
  "flesh-and-blood.draw.private",
  "flesh-and-blood.look.private",
  "flesh-and-blood.opt.private",
  "flesh-and-blood.search.found",
]);

function recordRichness(record: FabLiveEngineLogRecord): number {
  return record.log.entries.reduce(
    (score, entry) =>
      score +
      1_000 +
      (VIEWER_DETAIL_LOG_KEYS.has(entry.message.key) ? 100 : 0) +
      (entry.message.cardRefs?.length ?? 0) * 10 +
      Object.keys(entry.message.values).length,
    0,
  );
}

function parseFabEngineLogRecord(value: unknown): FabLiveEngineLogRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  const isBootstrapLog = candidate.kind === "player-narrative";
  const stateVersion = isBootstrapLog ? 0 : candidate.stateVersion;
  const timestamp = candidate.timestamp;
  const rawLog = isBootstrapLog ? candidate : candidate.log;
  if (
    typeof stateVersion !== "number" ||
    !Number.isFinite(stateVersion) ||
    typeof timestamp !== "number" ||
    !Number.isFinite(timestamp) ||
    !rawLog ||
    typeof rawLog !== "object"
  ) {
    return null;
  }
  const log = rawLog as Record<string, unknown>;
  if (
    log.kind !== "player-narrative" ||
    log.schemaVersion !== 1 ||
    typeof log.commandId !== "string" ||
    typeof log.moveType !== "string" ||
    typeof log.actorId !== "string" ||
    typeof log.timestamp !== "number" ||
    !Number.isFinite(log.timestamp) ||
    typeof log.turnNumber !== "number" ||
    !Number.isFinite(log.turnNumber) ||
    typeof log.turnPlayerId !== "string" ||
    !isFabPhase(log.phase) ||
    !Array.isArray(log.entries) ||
    !log.entries.every(
      (entry) =>
        typeof entry === "object" &&
        entry !== null &&
        !("publicMessage" in entry) &&
        !("privateMessageByPlayerId" in entry) &&
        typeof (entry as { entryId?: unknown }).entryId === "string" &&
        isPlayerLogMessage((entry as { message?: unknown }).message),
    )
  ) {
    return null;
  }
  return {
    stateVersion,
    timestamp,
    log: rawLog as FabVisiblePlayerLog,
  };
}

/**
 * Accumulate viewer-safe engine log records across live payloads.
 *
 * Returns the same array reference when nothing changed (identical or
 * unparsable candidates), so state updates and the projection memo stay
 * idle for duplicate deliveries. On collision — the same sequence delivered
 * twice, e.g. the state_update broadcast plus the viewer-composed
 * `move_accepted` copy — the record with richer card identity wins.
 */
export function appendFabEngineLogRecords(
  existing: readonly FabLiveEngineLogRecord[],
  candidates: unknown,
): readonly FabLiveEngineLogRecord[] {
  if (!Array.isArray(candidates) || candidates.length === 0) return existing;
  const byKey = new Map(existing.map((record) => [recordKey(record), record]));
  let changed = false;
  for (const candidate of candidates) {
    const record = parseFabEngineLogRecord(candidate);
    if (!record) continue;
    const key = recordKey(record);
    const prior = byKey.get(key);
    const priorRichness = prior ? recordRichness(prior) : undefined;
    const nextRichness = recordRichness(record);
    if (prior && (priorRichness ?? 0) >= nextRichness) continue;
    byKey.set(key, record);
    changed = true;
  }
  if (!changed) return existing;
  return [...byKey.values()].slice(-FAB_LIVE_LOG_LIMIT);
}
