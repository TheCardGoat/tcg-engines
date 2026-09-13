import {
  createFabMatchContext,
  FAB_MOVE_NAMES,
  FabMatchRuntime,
  isFabPlayerLog,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  type FabMoveLog,
  type FabPlayerLog,
  type FabMatchSnapshotV21,
  type FabPracticeMatch,
} from "@tcg/flesh-and-blood-engine/simulator";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import type { FabLocalPracticeMatchInput } from "./data/create-local-practice-match";
import type {
  FabAnalyticsPlayerSeedV2,
  FabAnalyticsTransitionReceiptV2,
} from "@tcg/flesh-and-blood-server-adapter";
import { parseFabAnalyticsTransitionReceiptV2 } from "@tcg/flesh-and-blood-server-adapter";

export interface StoredFabPracticeConfig {
  readonly playerDeckId: string;
  readonly botDeckId: string;
  readonly botStrategyId: string | null;
  readonly seed: string;
}

export interface StoredFabPracticeDecisionSnapshot {
  readonly decisionId: string;
  readonly actorId: string;
  readonly kind: string;
  readonly label: string;
}

/** Compact, player-visible command history. Raw debug snapshots stay ephemeral. */
export interface StoredFabPracticeTelemetryEntry {
  readonly id: number;
  readonly source: "player" | "bot";
  readonly actorId: string;
  readonly controllerId: string;
  readonly interactionActorId: string;
  readonly commandLabel: string;
  readonly move: string;
  readonly result: "accepted";
  readonly recordedAt: number;
  readonly turnNumber: number;
  readonly stateId: number;
  /** New entries always carry the command-local narrative; optional restores v1 sessions. */
  readonly playerLog?: FabPlayerLog;
  readonly moveLogs: readonly FabMoveLog[];
  readonly decisionBefore: StoredFabPracticeDecisionSnapshot | null;
  readonly pendingDecision: StoredFabPracticeDecisionSnapshot | null;
  readonly completedDecision: StoredFabPracticeDecisionSnapshot | null;
}

export interface StoredFabPracticeChatMessage {
  readonly id: number;
  readonly recordedAt: number;
  readonly turn: number;
  readonly actorId: string;
  readonly message: string;
}

export interface StoredFabPracticeHistory {
  readonly telemetry: readonly StoredFabPracticeTelemetryEntry[];
  readonly chatMessages: readonly StoredFabPracticeChatMessage[];
  readonly analytics?: {
    readonly startedAt: number;
    readonly initialTurnPlayerId: string;
    readonly players: readonly FabAnalyticsPlayerSeedV2[];
    readonly transitionReceipts: readonly FabAnalyticsTransitionReceiptV2[];
  };
}

export const EMPTY_FAB_PRACTICE_HISTORY: StoredFabPracticeHistory = {
  telemetry: [],
  chatMessages: [],
};

interface StoredFabPracticeSessionV1 {
  readonly version: 1;
  readonly config: StoredFabPracticeConfig;
  readonly snapshot: FabMatchSnapshotV21;
  readonly history?: StoredFabPracticeHistory;
}

export type RestoredFabPracticeSession =
  | { readonly kind: "none" }
  | {
      readonly kind: "restored";
      readonly config: StoredFabPracticeConfig;
      readonly match: FabPracticeMatch;
      readonly history: StoredFabPracticeHistory;
    }
  | { readonly kind: "error"; readonly message: string };

const ACTIVE_PRACTICE_SESSION_KEY = "fab-practice:active-match:v1";
const FAB_MOVE_NAME_SET: ReadonlySet<string> = new Set(FAB_MOVE_NAMES);

export type FabPracticeContextSourceFactory = (
  input: FabLocalPracticeMatchInput,
) => Pick<FabPracticeMatch, "runtime">;

function isStoredConfig(value: unknown): value is StoredFabPracticeConfig {
  if (typeof value !== "object" || value === null) return false;
  const config = value as Partial<Record<keyof StoredFabPracticeConfig, unknown>>;
  return (
    typeof config.playerDeckId === "string" &&
    typeof config.botDeckId === "string" &&
    (typeof config.botStrategyId === "string" || config.botStrategyId === null) &&
    typeof config.seed === "string"
  );
}

function isDecisionSnapshot(value: unknown): value is StoredFabPracticeDecisionSnapshot {
  if (typeof value !== "object" || value === null) return false;
  const decision = value as Partial<Record<keyof StoredFabPracticeDecisionSnapshot, unknown>>;
  return (
    typeof decision.decisionId === "string" &&
    typeof decision.actorId === "string" &&
    typeof decision.kind === "string" &&
    typeof decision.label === "string"
  );
}

function isNullableDecisionSnapshot(value: unknown): boolean {
  return value === null || isDecisionSnapshot(value);
}

function isLogValue(value: unknown): value is string | number | boolean | null {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function isMoveLogMessage(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const message = value as {
    readonly key?: unknown;
    readonly values?: unknown;
    readonly objectRefs?: unknown;
    readonly defaultMessage?: unknown;
  };
  if (typeof message.key !== "string" || typeof message.defaultMessage !== "string") return false;
  if (
    message.values !== undefined &&
    (typeof message.values !== "object" ||
      message.values === null ||
      !Object.values(message.values).every(isLogValue))
  ) {
    return false;
  }
  if (message.objectRefs === undefined) return true;
  if (typeof message.objectRefs !== "object" || message.objectRefs === null) return false;
  return Object.values(message.objectRefs).every(
    (reference) =>
      typeof reference === "object" &&
      reference !== null &&
      typeof (reference as { readonly instanceId?: unknown }).instanceId === "string" &&
      ((reference as { readonly canonicalId?: unknown }).canonicalId === null ||
        typeof (reference as { readonly canonicalId?: unknown }).canonicalId === "string"),
  );
}

function isMoveLog(value: unknown): value is FabMoveLog {
  if (typeof value !== "object" || value === null) return false;
  const log = value as {
    readonly moveType?: unknown;
    readonly playerId?: unknown;
    readonly timestamp?: unknown;
    readonly sequence?: unknown;
    readonly turnNumber?: unknown;
    readonly public?: unknown;
    readonly privateByPlayerId?: unknown;
  };
  if (
    typeof log.moveType !== "string" ||
    !FAB_MOVE_NAME_SET.has(log.moveType) ||
    typeof log.playerId !== "string" ||
    typeof log.timestamp !== "number" ||
    typeof log.sequence !== "number" ||
    typeof log.turnNumber !== "number" ||
    !Array.isArray(log.public) ||
    !log.public.every(isMoveLogMessage)
  ) {
    return false;
  }
  if (log.privateByPlayerId === undefined) return true;
  return (
    typeof log.privateByPlayerId === "object" &&
    log.privateByPlayerId !== null &&
    Object.values(log.privateByPlayerId).every(
      (messages) => Array.isArray(messages) && messages.every(isMoveLogMessage),
    )
  );
}

function isStoredTelemetryEntry(value: unknown): value is StoredFabPracticeTelemetryEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Partial<Record<keyof StoredFabPracticeTelemetryEntry, unknown>>;
  return (
    typeof entry.id === "number" &&
    (entry.source === "player" || entry.source === "bot") &&
    typeof entry.actorId === "string" &&
    typeof entry.controllerId === "string" &&
    typeof entry.interactionActorId === "string" &&
    typeof entry.commandLabel === "string" &&
    typeof entry.move === "string" &&
    entry.result === "accepted" &&
    typeof entry.recordedAt === "number" &&
    typeof entry.turnNumber === "number" &&
    typeof entry.stateId === "number" &&
    (entry.playerLog === undefined || isFabPlayerLog(entry.playerLog)) &&
    Array.isArray(entry.moveLogs) &&
    entry.moveLogs.every(isMoveLog) &&
    isNullableDecisionSnapshot(entry.decisionBefore) &&
    isNullableDecisionSnapshot(entry.pendingDecision) &&
    isNullableDecisionSnapshot(entry.completedDecision)
  );
}

function isStoredChatMessage(value: unknown): value is StoredFabPracticeChatMessage {
  if (typeof value !== "object" || value === null) return false;
  const message = value as Partial<Record<keyof StoredFabPracticeChatMessage, unknown>>;
  return (
    typeof message.id === "number" &&
    typeof message.recordedAt === "number" &&
    typeof message.turn === "number" &&
    typeof message.actorId === "string" &&
    typeof message.message === "string"
  );
}

function storedHistory(value: unknown): StoredFabPracticeHistory {
  if (typeof value !== "object" || value === null) return EMPTY_FAB_PRACTICE_HISTORY;
  const history = value as { readonly telemetry?: unknown; readonly chatMessages?: unknown };
  if (
    !Array.isArray(history.telemetry) ||
    !history.telemetry.every(isStoredTelemetryEntry) ||
    !Array.isArray(history.chatMessages) ||
    !history.chatMessages.every(isStoredChatMessage)
  ) {
    return EMPTY_FAB_PRACTICE_HISTORY;
  }
  const analytics = storedAnalytics((history as { readonly analytics?: unknown }).analytics);
  return {
    telemetry: history.telemetry,
    chatMessages: history.chatMessages,
    ...(analytics ? { analytics } : {}),
  };
}

function storedAnalytics(value: unknown): StoredFabPracticeHistory["analytics"] {
  if (typeof value !== "object" || value === null) return undefined;
  const analytics = value as {
    readonly startedAt?: unknown;
    readonly initialTurnPlayerId?: unknown;
    readonly players?: unknown;
    readonly transitionReceipts?: unknown;
  };
  if (
    typeof analytics.startedAt !== "number" ||
    typeof analytics.initialTurnPlayerId !== "string" ||
    !Array.isArray(analytics.players) ||
    !analytics.players.every(
      (player) =>
        typeof player === "object" &&
        player !== null &&
        typeof (player as { playerId?: unknown }).playerId === "string" &&
        typeof (player as { heroName?: unknown }).heroName === "string" &&
        typeof (player as { initialLife?: unknown }).initialLife === "number" &&
        ((player as { seat?: unknown }).seat === 1 || (player as { seat?: unknown }).seat === 2) &&
        ((player as { heroCanonicalId?: unknown }).heroCanonicalId === null ||
          typeof (player as { heroCanonicalId?: unknown }).heroCanonicalId === "string") &&
        Array.isArray((player as { openingHand?: unknown }).openingHand),
    ) ||
    !Array.isArray(analytics.transitionReceipts)
  ) {
    return undefined;
  }
  try {
    return {
      startedAt: analytics.startedAt,
      initialTurnPlayerId: analytics.initialTurnPlayerId,
      players: analytics.players.map((player) => {
        const candidate = player as {
          readonly playerId: string;
          readonly heroName: string;
          readonly initialLife: number;
          readonly seat: 1 | 2;
          readonly heroCanonicalId: string | null;
          readonly openingHand: FabAnalyticsPlayerSeedV2["openingHand"];
        };
        return {
          playerId: candidate.playerId,
          heroName: candidate.heroName,
          initialLife: candidate.initialLife,
          seat: candidate.seat,
          heroCanonicalId: candidate.heroCanonicalId,
          openingHand: candidate.openingHand,
        };
      }),
      transitionReceipts: analytics.transitionReceipts.map(parseFabAnalyticsTransitionReceiptV2),
    };
  } catch {
    return undefined;
  }
}

function compactHistory(history: StoredFabPracticeHistory): StoredFabPracticeHistory {
  return {
    telemetry: history.telemetry.map((entry) => ({
      id: entry.id,
      source: entry.source,
      actorId: entry.actorId,
      controllerId: entry.controllerId,
      interactionActorId: entry.interactionActorId,
      commandLabel: entry.commandLabel,
      move: entry.move,
      result: entry.result,
      recordedAt: entry.recordedAt,
      turnNumber: entry.turnNumber,
      stateId: entry.stateId,
      ...(entry.playerLog ? { playerLog: entry.playerLog } : {}),
      moveLogs: entry.moveLogs,
      decisionBefore: entry.decisionBefore,
      pendingDecision: entry.pendingDecision,
      completedDecision: entry.completedDecision,
    })),
    chatMessages: history.chatMessages,
    ...(history.analytics ? { analytics: history.analytics } : {}),
  };
}

export function persistFabPracticeSession(
  match: Pick<FabPracticeMatch, "runtime" | "player1Id" | "player2Id" | "seed">,
  config: StoredFabPracticeConfig,
  storageKey = ACTIVE_PRACTICE_SESSION_KEY,
  history: StoredFabPracticeHistory = EMPTY_FAB_PRACTICE_HISTORY,
  validatedSnapshot?: FabMatchSnapshotV21,
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored: StoredFabPracticeSessionV1 = {
      version: 1,
      config,
      snapshot: validatedSnapshot ?? match.runtime.snapshot(),
      history: compactHistory(history),
    };
    window.sessionStorage.setItem(storageKey, JSON.stringify(stored));
    return true;
  } catch {
    // A rules procedure can temporarily be non-serializable. Keep the most
    // recent stable checkpoint rather than replacing it with partial state.
    return false;
  }
}

export function restoreFabPracticeSession(
  createContextSource: FabPracticeContextSourceFactory,
  storageKey = ACTIVE_PRACTICE_SESSION_KEY,
): RestoredFabPracticeSession {
  if (typeof window === "undefined") return { kind: "none" };
  const serialized = window.sessionStorage.getItem(storageKey);
  if (!serialized) return { kind: "none" };
  try {
    const value: unknown = JSON.parse(serialized);
    if (typeof value !== "object" || value === null) throw new Error("Invalid session document.");
    const candidate = value as {
      readonly version?: unknown;
      readonly config?: unknown;
      readonly snapshot?: unknown;
      readonly history?: unknown;
    };
    if (
      candidate.version !== 1 ||
      !isStoredConfig(candidate.config) ||
      !isFabMatchSnapshotV21(candidate.snapshot)
    ) {
      // A snapshot is an exact engine schema. Do not leave an obsolete
      // checkpoint in storage where every subsequent visit retries it.
      window.sessionStorage.removeItem(storageKey);
      return { kind: "none" };
    }
    const contextSource = createContextSource({
      player1DeckId: candidate.config.playerDeckId,
      player2DeckId: candidate.config.botDeckId,
      player1Id: "player-1",
      player2Id: "player-2",
      firstPlayerId: "player-1",
      seed: candidate.config.seed,
    }).runtime.getState();
    const context = createFabMatchContext(
      contextSource.cardDefinitions,
      contextSource.publicCardIdentities,
    );
    const runtime = new FabMatchRuntime(restoreFabMatchSnapshot(candidate.snapshot, context));
    const engine = FabTestEngine.fromRuntime(runtime);
    const [player1Id, player2Id] = runtime.playerIds();
    if (!player1Id || !player2Id) throw new Error("The saved match does not contain two players.");
    return {
      kind: "restored",
      config: candidate.config,
      match: { runtime, engine, player1Id, player2Id, seed: candidate.config.seed },
      history: storedHistory(candidate.history),
    };
  } catch (error) {
    return {
      kind: "error",
      message: error instanceof Error ? error.message : "The saved match could not be restored.",
    };
  }
}

export function clearFabPracticeSession(storageKey = ACTIVE_PRACTICE_SESSION_KEY): void {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(storageKey);
  }
}

const PREPARATION_CONFIG_KEY = "fab-practice:preparation:v1";
export function persistFabPracticePreparation(config: StoredFabPracticeConfig | null): void {
  try {
    if (config) sessionStorage.setItem(PREPARATION_CONFIG_KEY, JSON.stringify(config));
    else sessionStorage.removeItem(PREPARATION_CONFIG_KEY);
  } catch {
    /* Practice remains available when browser storage is disabled. */
  }
}
export function restoreFabPracticePreparation(): StoredFabPracticeConfig | null {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(PREPARATION_CONFIG_KEY) ?? "null");
    return isStoredConfig(value) ? value : null;
  } catch {
    return null;
  }
}
