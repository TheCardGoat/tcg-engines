import { getLorcanaCardCatalogSync } from "@tcg/lorcana-cards/cards/sync";
import { selectVisibleEngineLogForViewer } from "@tcg/shared/game-engine";
import {
  createPlayerId,
  createLorcanaClient,
  type CardsMaps,
  type LorcanaClient,
  type LorcanaMatchState,
  type MoveLog,
} from "@tcg/lorcana-engine";
import type { GatewayClientStore } from "../gateway/gateway-client.svelte.js";
import type {
  LogCardReference,
  LorcanaPlayerSide,
  LorcanaSimulatorMoveId,
  LorcanaZoneId,
  MoveLogEntrySnapshot,
  SimulatorSerializedObject,
} from "../simulator/model/contracts.js";
import { isLorcanaSimulatorMoveId } from "../simulator/model/contracts.js";
import {
  composeMoveLogForViewer,
  formatEventLogBody,
} from "../simulator/model/event-log-formatting.js";

export interface SpectatorRecentHistory {
  acceptedMoves: Array<{
    actorId: string;
    moveId: string;
    stateVersion: number;
    timestamp: number;
    turnNumber: number;
    input?: unknown;
  }>;
  engineLogs: Array<{
    stateVersion: number;
    log: unknown;
  }>;
}

type SpectatorAcceptedMove = SpectatorRecentHistory["acceptedMoves"][number];
type SpectatorEngineLog = SpectatorRecentHistory["engineLogs"][number];

function isCanonicalMoveLog(log: unknown): log is MoveLog {
  return (
    typeof log === "object" &&
    log !== null &&
    typeof (log as { moveType?: unknown }).moveType === "string" &&
    Array.isArray((log as { public?: unknown }).public)
  );
}

function getCanonicalMoveLogType(log: unknown): string {
  return isCanonicalMoveLog(log) ? log.moveType : "";
}

function getCanonicalMoveLogPlayerId(log: unknown): string | null {
  return isCanonicalMoveLog(log) ? log.playerId : null;
}

function getVisibleMoveLog(
  log: unknown,
  viewerId: string | null,
): MoveLogEntrySnapshot["typedLogEntry"] {
  return (
    isCanonicalMoveLog(log)
      ? composeMoveLogForViewer(log, viewerId)
      : selectVisibleEngineLogForViewer(log, viewerId)
  ) as MoveLogEntrySnapshot["typedLogEntry"];
}

export class SpectatorReadModel {
  #listeners = new Set<(stateID: number) => void>();
  #stateId = 0;
  #moveLog: MoveLogEntrySnapshot[] = [];

  getMoveLog(limit = 50): MoveLogEntrySnapshot[] {
    return limit > 0 ? this.#moveLog.slice(-limit) : [...this.#moveLog];
  }

  subscribeStateUpdates(handler: (stateID: number) => void): () => void {
    this.#listeners.add(handler);
    return () => {
      this.#listeners.delete(handler);
    };
  }

  pushEntries(entries: MoveLogEntrySnapshot[]): void {
    if (entries.length === 0) {
      return;
    }

    const existingIds = new Set(this.#moveLog.map((e) => e.id));
    const newEntries = entries.filter((e) => !existingIds.has(e.id));
    if (newEntries.length === 0) {
      return;
    }

    this.#moveLog = [...this.#moveLog, ...newEntries];
    this.bump();
  }

  notifyStateUpdated(): void {
    this.bump();
  }

  bump(): void {
    this.#stateId += 1;
    for (const listener of this.#listeners) {
      listener(this.#stateId);
    }
  }
}

function normalizePersistedMoveParams(input?: unknown): SimulatorSerializedObject | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return undefined;
  }

  const args = "args" in input ? (input as { args?: unknown }).args : undefined;
  if (!args || typeof args !== "object" || Array.isArray(args)) {
    return undefined;
  }

  return args as SimulatorSerializedObject;
}

function parseBaseZone(zone?: string): LorcanaZoneId | null {
  if (!zone) {
    return null;
  }

  const [baseZone] = zone.split(":");
  switch (baseZone) {
    case "deck":
    case "hand":
    case "play":
    case "discard":
    case "inkwell":
      return baseZone;
    default:
      return null;
  }
}

export function createSpectatorHistoryEntries(args: {
  acceptedMoves: SpectatorRecentHistory["acceptedMoves"];
  engineLogs: SpectatorRecentHistory["engineLogs"];
  engine?: LorcanaClient;
  cardsMaps?: CardsMaps;
  resolveActorSide: (actorId: string) => LorcanaPlayerSide | undefined;
  /** Viewer identity for defense-in-depth privacy stripping. Defaults to null (spectator). */
  viewerId?: string | null;
}): MoveLogEntrySnapshot[] {
  const viewerId = args.viewerId ?? null;
  const resolveCard = buildCardReferenceResolver(args.engine, args.cardsMaps);

  return args.acceptedMoves.flatMap((move, moveIndex) => {
    if (!isLorcanaSimulatorMoveId(move.moveId)) {
      return [];
    }

    const primaryMoveId = move.moveId;
    const params = normalizePersistedMoveParams(move.input);
    // Collect ALL logs for this dispatch (same stateVersion), not just the first.
    // A single dispatch may produce multiple logs: one for the primary action and
    // additional ones for auto-resolved triggered abilities (resolveBag entries).
    const matchingLogs = args.engineLogs.filter(
      (entry) => entry.stateVersion === move.stateVersion,
    );

    if (matchingLogs.length === 0) {
      // No matching log — show the move with fallback display text.
      const entry: MoveLogEntrySnapshot = {
        id: `spectator-history-${move.stateVersion}-${moveIndex}-${move.moveId}`,
        timestamp: move.timestamp,
        turnNumber: move.turnNumber,
        moveId: move.moveId,
        actorSide: args.resolveActorSide(move.actorId),
        title: "",
        playerId: move.actorId,
        params,
        typedLogEntry: undefined,
      };
      return [
        { ...entry, title: formatEventLogBody(entry, undefined, undefined, resolveCard).text },
      ];
    }

    return matchingLogs.flatMap((matchingLog, logIndex) => {
      const log = matchingLog.log;
      const logType = getCanonicalMoveLogType(log);

      // The first log corresponds to the primary dispatched action; subsequent
      // logs are sub-effects (triggered abilities, etc.).
      const isPrimary = logIndex === 0;
      const logMoveId: LorcanaSimulatorMoveId | null = isPrimary
        ? primaryMoveId
        : isLorcanaSimulatorMoveId(logType)
          ? logType
          : null;

      // Skip sub-logs whose moveType doesn't map to a known simulator move ID
      // (e.g. "turnStart", "gameEnd" are surfaced via other mechanisms).
      if (!logMoveId) return [];

      // Sub-effects carry their own playerId (the controller of the triggered ability).
      const logPlayerId = isPrimary
        ? move.actorId
        : (getCanonicalMoveLogPlayerId(log) ?? move.actorId);

      const visibleLog = getVisibleMoveLog(log, viewerId);

      const entry: MoveLogEntrySnapshot = {
        id: `spectator-history-${move.stateVersion}-${moveIndex}-${logMoveId}-${logIndex}`,
        timestamp: move.timestamp,
        turnNumber: move.turnNumber,
        moveId: logMoveId,
        actorSide: args.resolveActorSide(logPlayerId),
        title: "",
        playerId: logPlayerId,
        params: isPrimary ? params : undefined,
        typedLogEntry: visibleLog,
      };

      return [
        { ...entry, title: formatEventLogBody(entry, undefined, undefined, resolveCard).text },
      ];
    });
  });
}

/**
 * Build one or more MoveLogEntrySnapshot entries from a live state_update packet.
 *
 * A single dispatch on the server can auto-resolve several moves (e.g. playCard
 * followed by one or more triggered-ability resolveBag moves). All of those
 * share the same stateVersion but produce distinct engineLog entries. This
 * function creates one snapshot per engineLog so that:
 *   - Every sub-effect (triggered ability, auto-resolved bag) is visible in the log.
 *   - Each sub-effect is attributed to the correct player (the ability's controller),
 *     not always to the original move dispatcher.
 */
export function createLiveEntries(args: {
  acceptedMove: SpectatorAcceptedMove;
  engineLogs: SpectatorEngineLog[];
  engine: LorcanaClient;
  cardsMaps: CardsMaps;
  resolveActorSide: (actorId: string) => LorcanaPlayerSide | undefined;
  /** Viewer identity for defense-in-depth privacy stripping. Defaults to null (spectator). */
  viewerId?: string | null;
}): MoveLogEntrySnapshot[] {
  const viewerId = args.viewerId ?? null;
  // If the dispatched move ID isn't a known simulator move (e.g. a future engine-internal
  // moveType), fall through to the sub-effect scan so triggered abilities still surface.
  const primaryMoveId = isLorcanaSimulatorMoveId(args.acceptedMove.moveId)
    ? args.acceptedMove.moveId
    : null;
  const params = normalizePersistedMoveParams(args.acceptedMove.input);
  const resolveCard = buildCardReferenceResolver(args.engine, args.cardsMaps);

  if (args.engineLogs.length === 0) {
    // No engine logs (e.g. manual moves) — single fallback entry.
    if (!primaryMoveId) return [];
    const entry: MoveLogEntrySnapshot = {
      // stateVersion is stable across move_accepted (unicast to issuer) and
      // state_update (broadcast to everyone) for the same move; using it for
      // the dedup id prevents duplicate entries on the dispatcher's screen.
      // Manual moves emit no engine logs, so buildAcceptedMove falls back to
      // Date.now() per packet — that wall-clock differs between the two
      // arrivals and would otherwise sneak past pushEntries' Set-based dedup.
      id: `spectator-live-${args.acceptedMove.stateVersion}-${primaryMoveId}`,
      timestamp: args.acceptedMove.timestamp,
      turnNumber: args.acceptedMove.turnNumber,
      moveId: primaryMoveId,
      actorSide: args.resolveActorSide(args.acceptedMove.actorId),
      title: "",
      playerId: args.acceptedMove.actorId,
      params,
      typedLogEntry: undefined,
    };
    return [{ ...entry, title: formatEventLogBody(entry, undefined, undefined, resolveCard).text }];
  }

  return args.engineLogs.flatMap((engineLog, logIndex) => {
    const log = engineLog.log;
    const logType = getCanonicalMoveLogType(log);

    // First log = primary dispatched action; subsequent = auto-resolved sub-effects.
    // If primaryMoveId is null (unknown dispatched type), treat log[0] as a sub-effect too.
    const isPrimary = logIndex === 0 && primaryMoveId !== null;
    const logMoveId: LorcanaSimulatorMoveId | null = isPrimary
      ? primaryMoveId
      : isLorcanaSimulatorMoveId(logType)
        ? logType
        : null;

    // Skip sub-logs whose moveType doesn't map to a known simulator move ID
    // (e.g. "turnStart" / "gameEnd" are surfaced via other mechanisms).
    if (!logMoveId) return [];

    // Sub-effects carry their own playerId (the controller of the triggered ability).
    const logPlayerId = isPrimary
      ? args.acceptedMove.actorId
      : (getCanonicalMoveLogPlayerId(log) ?? args.acceptedMove.actorId);

    const visibleLog = getVisibleMoveLog(log, viewerId);

    const entry: MoveLogEntrySnapshot = {
      id: `spectator-live-${args.acceptedMove.stateVersion}-${logMoveId}-${logIndex}`,
      timestamp: args.acceptedMove.timestamp,
      turnNumber: args.acceptedMove.turnNumber,
      moveId: logMoveId,
      actorSide: args.resolveActorSide(logPlayerId),
      title: "",
      playerId: logPlayerId,
      params: isPrimary ? params : undefined,
      typedLogEntry: visibleLog,
    };

    return [{ ...entry, title: formatEventLogBody(entry, undefined, undefined, resolveCard).text }];
  });
}

/** @deprecated Use {@link createLiveEntries} instead. Returns the first entry or a blank placeholder. */
export function createLiveEntry(
  args: Parameters<typeof createLiveEntries>[0],
): MoveLogEntrySnapshot {
  const entries = createLiveEntries(args);
  if (entries[0]) return entries[0];
  // Absolute fallback: blank entry so callers expecting a non-null value don't crash.
  const resolveCard = buildCardReferenceResolver(args.engine, args.cardsMaps);
  const moveId = isLorcanaSimulatorMoveId(args.acceptedMove.moveId)
    ? args.acceptedMove.moveId
    : "passTurn"; // safe default — will render as an empty/unknown row
  const entry: MoveLogEntrySnapshot = {
    id: `spectator-live-${args.acceptedMove.stateVersion}-${moveId}`,
    timestamp: args.acceptedMove.timestamp,
    turnNumber: args.acceptedMove.turnNumber,
    moveId,
    actorSide: args.resolveActorSide(args.acceptedMove.actorId),
    title: "",
    playerId: args.acceptedMove.actorId,
    params: undefined,
    typedLogEntry: undefined,
  };
  return { ...entry, title: formatEventLogBody(entry, undefined, undefined, resolveCard).text };
}

function buildCardReferenceResolver(
  engine: LorcanaClient | undefined,
  cardsMaps: CardsMaps | undefined,
): (cardId: string) => LogCardReference | null {
  const board = engine?.getBoard();
  const cardCatalog = getLorcanaCardCatalogSync();

  return (cardId: string): LogCardReference | null => {
    const projectedCard = board?.cards[cardId];
    if (projectedCard) {
      const isMasked = projectedCard.hidden === true;
      const ownerSide =
        (engine ? resolveOwnerSide(engine, projectedCard.ownerId) : undefined) ?? "playerOne";
      const definitionId = cardsMaps?.cardInstances[cardId];
      const definition = definitionId ? cardCatalog.get(definitionId) : undefined;
      const label = isMasked ? "A card" : (definition?.fullName ?? definition?.name ?? cardId);

      return {
        cardId,
        definitionId: definitionId ?? cardId,
        label,
        inkType:
          "inkType" in (definition ?? {})
            ? (definition as { inkType: string[] }).inkType
            : undefined,
        inkable:
          "inkable" in (definition ?? {})
            ? (definition as { inkable: boolean }).inkable
            : undefined,
        isMasked,
        ownerSide,
        cardType: definition && "cardType" in definition ? definition.cardType : undefined,
        set: definition && "set" in definition ? definition.set : undefined,
        cardNumber: definition && "cardNumber" in definition ? definition.cardNumber : undefined,
      };
    }

    const definitionId = cardsMaps?.cardInstances[cardId];
    if (!definitionId) {
      return null;
    }
    const definition = definitionId ? cardCatalog.get(definitionId) : undefined;
    if (!definition) {
      return null;
    }

    return {
      cardId,
      definitionId,
      label: definition.fullName ?? definition.name,
      inkType: "inkType" in definition ? definition.inkType : undefined,
      inkable: "inkable" in definition ? definition.inkable : undefined,
      isMasked: false,
      ownerSide: "playerOne",
      cardType: "cardType" in definition ? definition.cardType : undefined,
      set: "set" in definition ? definition.set : undefined,
      cardNumber: "cardNumber" in definition ? definition.cardNumber : undefined,
    };
  };
}

function resolveOwnerSide(
  engine: LorcanaClient,
  ownerId: string | undefined,
): LorcanaPlayerSide | undefined {
  if (!ownerId) {
    return undefined;
  }

  const [playerOneId, playerTwoId] = engine.getBoard().playerOrder.map(String);
  if (ownerId === playerOneId) {
    return "playerOne";
  }
  if (ownerId === playerTwoId) {
    return "playerTwo";
  }
  return undefined;
}

/**
 * Extract LorcanaMatchState and CardsMaps from either a direct LorcanaMatchState
 * or a legacy snapshot with state nested inside engineSnapshot.
 *
 * Used by the replay orchestrator for parsing historical data. Live flows
 * now always use the flat format (state + cardsMaps as separate fields).
 */
export function extractMatchState(
  raw: unknown,
): { state: LorcanaMatchState; cardsMaps: CardsMaps } | null {
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as Record<string, unknown>;

  // Legacy format: state nested inside engineSnapshot (historical replays)
  if ("engineSnapshot" in obj && obj.engineSnapshot && typeof obj.engineSnapshot === "object") {
    const snap = obj.engineSnapshot as Record<string, unknown>;
    if (snap.state && snap.cardsMaps) {
      return {
        state: snap.state as LorcanaMatchState,
        cardsMaps: snap.cardsMaps as CardsMaps,
      };
    }
  }

  // Server-authority: direct LorcanaMatchState (has ctx.matchID)
  if ("ctx" in obj && obj.ctx && typeof obj.ctx === "object") {
    return { state: obj as unknown as LorcanaMatchState, cardsMaps: {} as CardsMaps };
  }

  return null;
}

export class SpectatorMatchOrchestrator {
  readonly readModel = new SpectatorReadModel();
  readonly #gateway: GatewayClientStore;
  readonly #cardsMaps: CardsMaps;
  #engine: LorcanaClient;

  constructor(args: {
    gateway: GatewayClientStore;
    state: LorcanaMatchState;
    cardsMaps: CardsMaps;
    recentHistory?: SpectatorRecentHistory;
  }) {
    this.#gateway = args.gateway;
    this.#cardsMaps = args.cardsMaps;
    const players = Object.keys(args.cardsMaps.owners).map((id) => ({ id }));
    this.#engine = createLorcanaClient({
      seed: args.state.ctx.random.seed,
      cardsMaps: args.cardsMaps,
      cardCatalog: getLorcanaCardCatalogSync(),
      players,
      playerId: "spectator",
      role: "spectator",
      matchID: args.state.ctx.matchID,
      gameID: args.state.ctx.gameID,
      goingFirst: createPlayerId(String(players[0]?.id ?? "player_one")),
    });
    this.#engine.loadState(args.state);

    if (args.recentHistory) {
      this.readModel.pushEntries(
        createSpectatorHistoryEntries({
          acceptedMoves: args.recentHistory.acceptedMoves,
          engineLogs: args.recentHistory.engineLogs,
          engine: this.#engine,
          cardsMaps: this.#cardsMaps,
          resolveActorSide: (actorId) => this.resolveActorSide(actorId),
        }),
      );
    }
  }

  get currentEngine(): LorcanaClient {
    return this.#engine;
  }

  dispose(): void {
    this.#gateway.send({ type: "leave_game", gameId: this.#engine.getState().ctx.gameID });
  }

  applyRecentHistory(history: SpectatorRecentHistory): void {
    this.readModel.pushEntries(
      createSpectatorHistoryEntries({
        acceptedMoves: history.acceptedMoves,
        engineLogs: history.engineLogs,
        engine: this.#engine,
        cardsMaps: this.#cardsMaps,
        resolveActorSide: (actorId) => this.resolveActorSide(actorId),
      }),
    );
  }

  applyStateUpdate(msg: {
    actorId: string;
    moveType: string;
    stateVersion: number;
    patches: unknown[];
    acceptedMove?: SpectatorAcceptedMove;
    engineLogs?: SpectatorEngineLog[];
    /** Full state snapshot (raw LorcanaMatchState), provided for client-authority games. */
    state?: unknown;
    /** Card instance mapping, included alongside state for client-authority updates. */
    cardsMaps?: CardsMaps;
  }): void {
    if (msg.state) {
      this.#engine.loadState(msg.state as LorcanaMatchState);
    } else if (msg.patches.length > 0) {
      console.warn(
        "[spectator] received patch-only state update while browser patches are disabled",
      );
    }

    if (msg.acceptedMove) {
      this.readModel.pushEntries(
        createLiveEntries({
          acceptedMove: msg.acceptedMove,
          engineLogs: msg.engineLogs ?? [],
          engine: this.#engine,
          cardsMaps: this.#cardsMaps,
          resolveActorSide: (actorId) => this.resolveActorSide(actorId),
        }),
      );
      return;
    }

    this.readModel.notifyStateUpdated();
  }

  private resolveActorSide(actorId: string): LorcanaPlayerSide | undefined {
    const [playerOneId, playerTwoId] = this.#engine.getBoard().playerOrder.map(String);
    if (actorId === playerOneId) {
      return "playerOne";
    }
    if (actorId === playerTwoId) {
      return "playerTwo";
    }
    return undefined;
  }
}
