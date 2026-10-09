import {
  coerceRiftboundClientMatchStateV1,
  createRiftboundClientMatchStateV1,
  isRiftboundClientMatchStateV1,
  reduceRiftboundClientMatchStateV1,
  type RiftboundClientCardDefinitionV1,
  type RiftboundClientMatchActionV1,
  type RiftboundClientMatchStateV1,
  type RiftboundZone,
} from "@tcg/riftbound-tabletop";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import { capUndoCheckpoints, createCanonicalEngineMoveLog, createEngineLogMessage } from "@tcg/shared/game-engine";
import type {
  DispatchContext, DispatchResult, DispatchSuccess, EngineSnapshot, ServerEngineCreateInput,
  ServerEngineRestoreContext, ServerGameEngine,
} from "@tcg/shared/game-engine";

interface UndoCheckpoint {
  actorId: string;
  moveId: string;
  stateVersion: number;
  state: RiftboundClientMatchStateV1;
}

interface UndoState {
  checkpoints: UndoCheckpoint[];
  turnStart: UndoCheckpoint | null;
  turnStartStateVersion: number | null;
}
type MoveSuccess = DispatchSuccess & { transition: "move" };

const ZONES: readonly RiftboundZone[] = [
  "deck", "hand", "play", "discard", "legend", "battlefields", "runes",
];

export class RiftboundServerEngine implements ServerGameEngine {
  private version: number;
  private undoState: UndoState;

  constructor(public state: RiftboundClientMatchStateV1, version = 0, undoState?: UndoState) {
    this.version = version;
    this.undoState = undoState ?? { checkpoints: [], turnStart: null,
      turnStartStateVersion: state.turn.actorId ? version : null };
  }

  getStateID(): number { return this.version; }
  getState(): unknown { return this.state; }
  getActivePlayerId(): string | undefined { return this.state.turn.actorId ?? undefined; }
  getInteractionActorIds(): readonly string[] { return this.state.players; }
  hasGameEnded(): boolean { return Boolean(this.state.terminal); }
  getGameEndResult(): { winnerId?: string; reason?: string } | undefined {
    const end = this.state.terminal;
    return end ? { ...(end.winnerId ? { winnerId: end.winnerId } : {}), reason: end.reason } : undefined;
  }

  getViewerState(viewer: { role: "player"; actorId: string } | { role: "spectator" } | { role: "replay" }): unknown {
    if (viewer.role === "player" && !this.state.players.includes(viewer.actorId)) {
      throw new Error("Viewer is not seated in this Riftbound match.");
    }
    const visible = structuredClone(this.state);
    const owner = viewer.role === "player" ? viewer.actorId : null;
    const visibleDefinitions = new Set<string>();
    for (const card of Object.values(visible.cards)) {
      const hidden = card.zone === "deck" ||
        (card.ownerId !== owner && (card.zone === "hand" || card.face === "down"));
      if (hidden) card.cardId = "hidden";
      else visibleDefinitions.add(card.cardId);
    }
    visible.cardDefinitions = Object.fromEntries(Object.entries(visible.cardDefinitions)
      .filter(([id]) => visibleDefinitions.has(id)));
    return visible;
  }

  getUndoState(): UndoState { return structuredClone(this.undoState); }
  canUndo(actorId: string): boolean {
    const last = this.undoState.checkpoints.at(-1);
    return Boolean(last && last.actorId === actorId && this.state.turn.actorId === actorId &&
      last.state.turn.number === this.state.turn.number && !this.state.terminal);
  }
  canUndoToTurnStart(actorId: string): boolean {
    return this.canUndo(actorId) && this.undoState.turnStart?.actorId === actorId &&
      this.undoState.turnStart.state.turn.number === this.state.turn.number;
  }

  dispatch(moveType: string, actorId: string, payload: Record<string, unknown>, context: DispatchContext): DispatchResult {
    if (!this.state.players.includes(actorId)) {
      return { success: false, error: "Actor is not seated.", errorCode: "unknown_actor", stateID: this.version };
    }
    if (moveType === "undo" || moveType === "undoToTurnStart") {
      return this.restoreUndo(actorId, context, moveType === "undo" ? "last_move" : "turn_start");
    }
    let action: RiftboundClientMatchActionV1;
    try { action = readAction(moveType, actorId, payload); }
    catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Invalid action.",
        errorCode: "invalid_move_payload", stateID: this.version };
    }
    const before = structuredClone(this.state);
    let next: RiftboundClientMatchStateV1;
    try { next = reduceRiftboundClientMatchStateV1(this.state, action); }
    catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Illegal action.",
        errorCode: "illegal_move", stateID: this.version };
    }
    if (next === this.state) {
      return { success: false, error: "No change was made.", errorCode: "illegal_move", stateID: this.version };
    }
    this.state = next;
    this.version += 1;
    if (isBarrier(before, next, action)) {
      this.undoState = { checkpoints: [], turnStart: null,
        turnStartStateVersion: action.type === "start_turn" ? this.version : null };
    } else {
      const checkpoint: UndoCheckpoint = {
        actorId, moveId: moveType, stateVersion: this.version - 1, state: before,
      };
      if (this.undoState.turnStartStateVersion === this.version - 1 && !this.undoState.turnStart) {
        this.undoState.turnStart = checkpoint;
      }
      this.undoState.checkpoints = capUndoCheckpoints([
        ...this.undoState.checkpoints,
        checkpoint,
      ]);
    }
    return this.result(actorId, moveType, action, context, Date.now());
  }

  private restoreUndo(actorId: string, context: DispatchContext, scope: "last_move" | "turn_start"): DispatchResult {
    const checkpoint = scope === "last_move" ? this.undoState.checkpoints.at(-1) : this.undoState.turnStart;
    const allowed = scope === "last_move" ? this.canUndo(actorId) : this.canUndoToTurnStart(actorId);
    if (!allowed || !checkpoint) {
      return { success: false, error: "No action is available to undo.", errorCode: "undo_unavailable", stateID: this.version };
    }
    const previousStateID = this.version;
    const restoredTurnStart = checkpoint.stateVersion === this.undoState.turnStart?.stateVersion;
    this.state = structuredClone(checkpoint.state);
    this.version += 1;
    if (scope === "turn_start") {
      this.undoState = { checkpoints: [], turnStart: null, turnStartStateVersion: this.version };
    } else {
      this.undoState.checkpoints.pop();
      if (this.undoState.checkpoints.length === 0) {
        this.undoState.turnStart = null;
        this.undoState.turnStartStateVersion = restoredTurnStart ? this.version : null;
      }
    }
    const moveId = scope === "last_move" ? "undo" : "undoToTurnStart";
    const timestamp = Date.now();
    return {
      ...this.result(actorId, moveId, { type: moveId }, context, timestamp),
      acceptedMoveRecord: {
        gameId: context.gameId, stateVersion: this.version, turnNumber: this.state.turn.number,
        actorId, moveId, input: { args: {} }, processedCommand: { move: moveId }, timestamp,
        sourceAuthority: context.sourceAuthority, transitionType: "undo", newStateID: this.version,
        undoneStateID: previousStateID, restoredCheckpointStateID: checkpoint.stateVersion,
        ...(scope === "last_move" ? { undoneMoveId: checkpoint.moveId } : {}),
      },
    };
  }

  private result(actorId: string, moveId: string, processedCommand: unknown,
    context: DispatchContext, timestamp: number): MoveSuccess {
    return {
      success: true, stateID: this.version, state: this.state, patches: [], animations: [],
      transition: "move", undoable: this.canUndo(actorId),
      acceptedMoveRecord: {
        gameId: context.gameId, stateVersion: this.version, turnNumber: this.state.turn.number,
        actorId, moveId, input: { args: processedCommand }, processedCommand, timestamp,
        sourceAuthority: context.sourceAuthority, newStateID: this.version,
      },
      engineLogRecords: [{ gameId: context.gameId, stateVersion: this.version, timestamp,
        sourceAuthority: context.sourceAuthority,
        log: createCanonicalEngineMoveLog({ moveType: moveId, playerId: actorId, timestamp,
          turnNumber: this.state.turn.number,
          messages: [createEngineLogMessage({ key: `riftbound.${moveId}` })] }),
      }],
    };
  }
}

function isBarrier(before: RiftboundClientMatchStateV1, after: RiftboundClientMatchStateV1,
  action: RiftboundClientMatchActionV1): boolean {
  if (action.type === "start_turn" || action.type === "draw" || action.type === "shuffle" ||
      action.type === "end_game") return true;
  if (before.turn.actorId !== action.actorId || before.turn.number !== after.turn.number) return true;
  if (action.type === "move_card") {
    const previous = before.cards[action.cardId];
    if (previous?.zone === "deck" || previous?.zone === "hand") return true;
  }
  if (action.type === "set_face" && action.face === "up" && before.cards[action.cardId]?.face === "down") return true;
  return false;
}

function string(value: unknown, name: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${name} must be a nonempty string.`);
  return value;
}
function number(value: unknown, name: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${name} must be a finite number.`);
  return value;
}
function zone(value: unknown): RiftboundZone {
  if (typeof value !== "string" || !ZONES.some((candidate) => candidate === value)) throw new Error("Unknown zone.");
  return value as RiftboundZone;
}
function readAction(moveType: string, actorId: string, payload: Record<string, unknown>): RiftboundClientMatchActionV1 {
  const base = { actorId, actionId: typeof payload.actionId === "string" ? payload.actionId : crypto.randomUUID(), at: Date.now() };
  switch (moveType) {
    case "start_turn": return { ...base, type: "start_turn" };
    case "move_card": return { ...base, type: "move_card", cardId: string(payload.cardId, "cardId"), zone: zone(payload.zone),
      ...(payload.x === undefined ? {} : { x: number(payload.x, "x") }),
      ...(payload.y === undefined ? {} : { y: number(payload.y, "y") }),
      ...(payload.stackId === undefined ? {} : { stackId: string(payload.stackId, "stackId") }) };
    case "set_face": {
      if (payload.face !== "up" && payload.face !== "down") throw new Error("Invalid face.");
      return { ...base, type: "set_face", cardId: string(payload.cardId, "cardId"), face: payload.face };
    }
    case "rotate": {
      if (payload.rotation !== 0 && payload.rotation !== 90 && payload.rotation !== 180 && payload.rotation !== 270)
        throw new Error("Invalid rotation.");
      return { ...base, type: "rotate", cardId: string(payload.cardId, "cardId"), rotation: payload.rotation };
    }
    case "set_counter": return { ...base, type: "set_counter", cardId: string(payload.cardId, "cardId"),
      counter: string(payload.counter, "counter"), value: number(payload.value, "value") };
    case "shuffle": {
      if (!Array.isArray(payload.order) || !payload.order.every((id) => typeof id === "string"))
        throw new Error("Shuffle order must be card ids.");
      return { ...base, type: "shuffle", ownerId: string(payload.ownerId, "ownerId"), zone: zone(payload.zone), order: payload.order };
    }
    case "draw": {
      const count = number(payload.count, "count");
      if (!Number.isSafeInteger(count) || count < 1 || count > 100) throw new Error("Invalid draw count.");
      return { ...base, type: "draw", ownerId: string(payload.ownerId, "ownerId"), count };
    }
    case "publish_statement": return { ...base, type: "publish_statement", statementId: string(payload.statementId, "statementId"),
      text: string(payload.text, "text"), ...(payload.replyToId === undefined ? {} : { replyToId: string(payload.replyToId, "replyToId") }) };
    case "withdraw_statement": return { ...base, type: "withdraw_statement", statementId: string(payload.statementId, "statementId") };
    case "acknowledge_statement": return { ...base, type: "acknowledge_statement", statementId: string(payload.statementId, "statementId") };
    case "spotlight_statement": return { ...base, type: "spotlight_statement",
      ...(payload.statementId === undefined ? {} : { statementId: string(payload.statementId, "statementId") }) };
    case "end_game": return { ...base, type: "end_game", reason: string(payload.reason, "reason"),
      ...(payload.winnerId === undefined ? {} : { winnerId: string(payload.winnerId, "winnerId") }) };
    default: throw new Error(`Unknown Riftbound move: ${moveType}`);
  }
}

export function createRiftboundServerEngine(input: ServerEngineCreateInput,
  cardDefinitions: Record<string, RiftboundClientCardDefinitionV1>): RiftboundServerEngine {
  if (input.timeControl && input.timeControl.mode !== "none") throw new Error("Riftbound manual tabletop is clockless.");
  return new RiftboundServerEngine(createRiftboundClientMatchStateV1(
    [input.player1Id, input.player2Id], input.cardsMaps, cardDefinitions,
  ));
}

export function serializeRiftboundServerEngine(engine: ServerGameEngine, cardsMaps: CardsMaps): EngineSnapshot {
  if (!(engine instanceof RiftboundServerEngine)) throw new Error("Expected RiftboundServerEngine.");
  return { gameSlug: "riftbound", state: { ...structuredClone(engine.state), stateVersion: engine.getStateID() }, historyLength: engine.getStateID(),
    cardsMaps, metadata: { stateVersion: engine.getStateID(), undo: engine.getUndoState() } };
}

export function riftboundSnapshotFromClientAuthorityState(
  serializedState: string,
  storedVersion: number,
  seats: { player1Id: string; player2Id: string },
  fallbackCardsMaps?: CardsMaps,
): EngineSnapshot | null {
  if (!Number.isSafeInteger(storedVersion) || storedVersion < 0) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(serializedState) as unknown;
  } catch {
    return null;
  }
  const envelope = isRecord(parsed) ? parsed : null;
  const state = coerceRiftboundClientMatchStateV1(
    envelope && "state" in envelope ? envelope.state : parsed,
  );
  if (!state || state.players[0] !== seats.player1Id || state.players[1] !== seats.player2Id) return null;
  const envelopeMaps = envelope ? cardsMapsFrom(envelope.cardsMaps) : undefined;
  const cardsMaps = envelopeMaps ?? fallbackCardsMaps;
  if (!cardsMaps) return null;
  const metadata = envelope && isRecord(envelope.metadata) ? envelope.metadata : undefined;
  const undo = isUndoState(metadata?.undo)
    ? metadata.undo
    : { checkpoints: [], turnStart: null, turnStartStateVersion: state.turn.actorId ? storedVersion : null };
  return {
    gameSlug: "riftbound",
    state: { ...state, stateVersion: storedVersion },
    historyLength: storedVersion,
    cardsMaps,
    metadata: { stateVersion: storedVersion, undo },
  };
}

export async function restoreRiftboundServerEngine(snapshot: EngineSnapshot,
  context: ServerEngineRestoreContext): Promise<ServerGameEngine> {
  const state = coerceRiftboundClientMatchStateV1(snapshot.state);
  if (snapshot.gameSlug !== "riftbound" || !state)
    throw new Error("Invalid Riftbound engine snapshot.");
  if (state.players[0] !== context.player1Id || state.players[1] !== context.player2Id)
    throw new Error("Riftbound snapshot seats do not match the match.");
  const metadata = isRecord(snapshot.metadata) ? snapshot.metadata : undefined;
  const metadataVersion = metadata?.stateVersion;
  const version = typeof metadataVersion === "number" && Number.isSafeInteger(metadataVersion)
    ? metadataVersion
    : snapshot.historyLength;
  if (!Number.isSafeInteger(version) || version < 0)
    throw new Error("Riftbound snapshot is missing its state version.");
  const { stateVersion: snapshotVersion, ...rawState } = state as RiftboundClientMatchStateV1 & {
    stateVersion?: number;
  };
  if (typeof snapshotVersion === "number" && snapshotVersion !== version)
    throw new Error("Riftbound snapshot version does not match metadata.");
  return new RiftboundServerEngine(structuredClone(rawState), version,
    isUndoState(metadata?.undo) ? metadata.undo : undefined);
}

function cardsMapsFrom(value: unknown): CardsMaps | undefined {
  if (!isRecord(value) || !isRecord(value.cardInstances) || !isRecord(value.owners)) return undefined;
  const cardInstances: Record<string, string> = {};
  for (const [id, cardId] of Object.entries(value.cardInstances)) {
    if (typeof cardId !== "string") return undefined;
    cardInstances[id] = cardId;
  }
  const owners: Record<string, string[]> = {};
  for (const [owner, instances] of Object.entries(value.owners)) {
    if (!Array.isArray(instances) || instances.some((id) => typeof id !== "string")) return undefined;
    owners[owner] = instances;
  }
  return { cardInstances, owners };
}

export function extractRiftboundCardsMaps(snapshot: EngineSnapshot): CardsMaps {
  if (!snapshot.cardsMaps) throw new Error("Riftbound snapshot is missing cardsMaps.");
  return snapshot.cardsMaps;
}

function isUndoState(value: unknown): value is UndoState {
  if (!isRecord(value)) return false;
  return Array.isArray(value.checkpoints) &&
    value.checkpoints.every((entry) => isRecord(entry) && typeof entry.actorId === "string" &&
      typeof entry.moveId === "string" && typeof entry.stateVersion === "number" &&
      isRiftboundClientMatchStateV1(entry.state)) &&
    (value.turnStart === null || (isRecord(value.turnStart) && typeof value.turnStart.actorId === "string" &&
      typeof value.turnStart.moveId === "string" && typeof value.turnStart.stateVersion === "number" &&
      isRiftboundClientMatchStateV1(value.turnStart.state))) &&
    (value.turnStartStateVersion === null || typeof value.turnStartStateVersion === "number");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
