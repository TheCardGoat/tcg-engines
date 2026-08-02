/**
 * Naruto {@link ServerGameEngine} wrap + adapter lifecycle hooks.
 *
 * Translation notes:
 * - The naruto engine's `applyAction` returns the SAME state reference for
 *   illegal actions; acceptance is detected by state identity, and every
 *   accepted action increments the adapter-owned CAS `stateVersion`.
 * - `dispatch(moveType, actorId, payload)` maps the platform actor id to the
 *   engine `"p1" | "p2"` seat via the seat map, builds a native `Action`,
 *   and applies it. `moveType` is the native action type (`"SUMMON"`, ...).
 * - Snapshots persist `{ gameSlug, stateVersion, seats, state }` — see
 *   state-mapper.ts. Restore re-wraps the payload without re-running setup,
 *   so a restored engine continues the version counter instead of resetting.
 * - Determinism: the engine is a pure reducer over `seed + actions`, so
 *   replaying the same seed and action sequence yields identical state JSON
 *   (asserted in engine.test.ts).
 */

import { getCardById } from "@tcg-engines/naruto-cards";
import {
  applyAction,
  chooseAiAction,
  createInitialState,
  deciderOf,
  type Action,
  type AttackerKind,
  type GameState,
  type PlayerId,
  type TargetKind,
} from "@tcg-engines/naruto-engine";
import {
  validateInteractionSubmission,
  type EngineInteractionView,
  type InteractionSubmission,
} from "@tcg/protocol";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import { createCanonicalEngineMoveLog, createEngineLogMessage } from "@tcg/shared/game-engine";
import type {
  BotActionOptions,
  BotActionResult,
  DispatchContext,
  DispatchResult,
  EngineLogRecord,
  EngineSnapshot,
  ServerEngineCreateInput,
  ServerEngineRestoreContext,
  ServerGameEngine,
} from "@tcg/shared/game-engine";

import { buildNarutoInteractionView, narutoSubmissionToAction } from "./interaction";
import {
  actorIdForPlayer,
  parseSnapshotState,
  playerIdForActor,
  toSnapshotState,
  type NarutoSeatMap,
} from "./state-mapper";

export class NarutoServerEngine implements ServerGameEngine {
  #state: GameState;
  #stateVersion: number;
  readonly seats: NarutoSeatMap;

  constructor(args: { state: GameState; seats: NarutoSeatMap; stateVersion?: number }) {
    this.#state = args.state;
    this.seats = { ...args.seats };
    this.#stateVersion = args.stateVersion ?? 0;
  }

  /** Raw engine state (serializable). Exposed for serializeEngine/tests. */
  getRawState(): GameState {
    return this.#state;
  }

  dispatch(
    moveType: string,
    actorId: string,
    payload: Record<string, unknown>,
    context: DispatchContext,
  ): DispatchResult {
    const player = playerIdForActor(this.seats, actorId);
    if (!player) {
      return {
        success: false,
        error: `Actor ${actorId} is not seated in this Naruto game.`,
        errorCode: "unknown_actor",
        stateID: this.#stateVersion,
      };
    }

    let action: Action;
    try {
      action = narutoActionFromPayload(moveType, payload, player);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Invalid Naruto action payload.",
        errorCode: "invalid_move_payload",
        stateID: this.#stateVersion,
      };
    }
    return this.#applyAction(action, actorId, context, moveType, payload);
  }

  getStateID(): number {
    return this.#stateVersion;
  }

  getState(): unknown {
    return this.#state;
  }

  getActivePlayerId(): string | undefined {
    const decider = deciderOf(this.#state);
    return decider === null ? undefined : actorIdForPlayer(this.seats, decider);
  }

  getInteractionActorIds(): readonly string[] {
    return [this.seats.p1, this.seats.p2];
  }

  hasGameEnded(): boolean {
    return this.#state.winner !== null;
  }

  getGameEndResult(): { winnerId?: string; reason?: string } | undefined {
    const winner = this.#state.winner;
    if (winner === null) return undefined;
    return { winnerId: actorIdForPlayer(this.seats, winner) };
  }

  getInteractionView(actorId: string): EngineInteractionView {
    return buildNarutoInteractionView({
      state: this.#state,
      seats: this.seats,
      actorId,
      stateVersion: this.#stateVersion,
    });
  }

  submitInteraction(
    actorId: string,
    submission: InteractionSubmission,
    context: DispatchContext,
  ): DispatchResult {
    const currentStateID = this.getStateID();
    const player = playerIdForActor(this.seats, actorId);
    if (!player) {
      return {
        success: false,
        error: `Actor ${actorId} is not seated in this Naruto game.`,
        errorCode: "unknown_actor",
        stateID: currentStateID,
      };
    }

    const view = this.getInteractionView(actorId);
    const validation = validateInteractionSubmission(view, submission);
    if (!validation.ok) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.issues.some((issue) => issue.code === "stale_state")
          ? "stale_interaction"
          : "invalid_interaction_submission",
        stateID: currentStateID,
      };
    }

    let action: Action;
    try {
      action = narutoSubmissionToAction({ submission, state: this.#state, player });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Invalid interaction submission.",
        errorCode: "invalid_interaction_submission",
        stateID: currentStateID,
      };
    }
    return this.#applyAction(action, actorId, context, action.type, actionToPayload(action));
  }

  takeAutomatedAction(_options: BotActionOptions, context: DispatchContext): BotActionResult {
    if (this.hasGameEnded()) {
      return {
        finalResult: {
          success: false,
          error: "Game has already ended.",
          errorCode: "game_ended",
          stateID: this.#stateVersion,
        },
        blocked: { reason: "game-ended" },
      };
    }
    const player = deciderOf(this.#state);
    if (player === null) {
      return {
        finalResult: {
          success: false,
          error: "No active player; cannot run automated action.",
          errorCode: "no_active_player",
          stateID: this.#stateVersion,
        },
        blocked: { reason: "no-active-player" },
      };
    }
    const actorId = actorIdForPlayer(this.seats, player);
    // Greedy engine policy; PASS_COUNTER / END_TURN are its built-in fallback.
    const action = chooseAiAction(this.#state, player);
    if (!action) {
      return {
        finalResult: {
          success: false,
          error: "No legal automated action available.",
          errorCode: "no_legal_action",
          stateID: this.#stateVersion,
        },
        blocked: { reason: "no-legal-action" },
      };
    }
    const result = this.#applyAction(
      action,
      actorId,
      context,
      action.type,
      actionToPayload(action),
    );
    return { finalResult: result, strategyId: "naruto-greedy" };
  }

  #applyAction(
    action: Action,
    actorId: string,
    context: DispatchContext,
    moveType: string,
    payload: Record<string, unknown>,
  ): DispatchResult {
    const previous = this.#state;
    const next = applyAction(previous, action);
    if (next === previous) {
      return {
        success: false,
        error: `Illegal Naruto action ${action.type} for ${action.player}.`,
        errorCode: "illegal_move",
        stateID: this.#stateVersion,
      };
    }

    this.#state = next;
    this.#stateVersion += 1;
    const stateVersion = this.#stateVersion;
    const timestamp = Date.now();
    const newLogEntries = next.log.slice(previous.log.length);

    const engineLogRecords: EngineLogRecord[] = [
      {
        gameId: context.gameId,
        stateVersion,
        timestamp,
        sourceAuthority: context.sourceAuthority,
        log: createCanonicalEngineMoveLog({
          moveType,
          playerId: actorId,
          timestamp,
          turnNumber: next.turn,
          messages: newLogEntries.map((entry) =>
            createEngineLogMessage({ key: entry.key, values: entry.values ?? {} }),
          ),
        }),
      },
    ];

    return {
      success: true,
      stateID: stateVersion,
      state: next,
      patches: [],
      animations: [],
      acceptedMoveRecord: {
        gameId: context.gameId,
        stateVersion,
        turnNumber: next.turn,
        actorId,
        moveId: moveType,
        input: { args: payload },
        processedCommand: action,
        timestamp,
        sourceAuthority: context.sourceAuthority,
        newStateID: stateVersion,
      },
      engineLogRecords,
      undoable: false,
      processedCommand: action,
    };
  }
}

// ---------------------------------------------------------------------------
// Payload translation
// ---------------------------------------------------------------------------

const NARUTO_ACTION_TYPES = [
  "MULLIGAN",
  "SUMMON",
  "SET_SUPPORT",
  "ACTIVATE_SUPPORT",
  "ACTIVATE_SUPPORT_FROM_HAND",
  "ACTIVATE_CHARACTER",
  "LEADER_EFFECT",
  "RECOVERY",
  "DECLARE_ATTACK",
  "PASS_COUNTER",
  "RESOLVE_CHOICE",
  "END_TURN",
] as const;

/** Build a native naruto `Action` from a dispatch moveType + payload. */
export function narutoActionFromPayload(
  moveType: string,
  payload: Record<string, unknown>,
  player: PlayerId,
): Action {
  switch (moveType) {
    case "MULLIGAN":
      return { type: "MULLIGAN", player, keep: payloadBoolean(payload, "keep") };
    case "SUMMON":
      return { type: "SUMMON", player, handUid: payloadString(payload, "handUid") };
    case "SET_SUPPORT":
      return { type: "SET_SUPPORT", player, handUid: payloadString(payload, "handUid") };
    case "ACTIVATE_SUPPORT": {
      const slot = payload.slot;
      if (typeof slot !== "number" || !Number.isInteger(slot) || slot < 0) {
        throw new Error('Naruto ACTIVATE_SUPPORT payload requires an integer "slot".');
      }
      return { type: "ACTIVATE_SUPPORT", player, slot };
    }
    case "ACTIVATE_SUPPORT_FROM_HAND":
      return {
        type: "ACTIVATE_SUPPORT_FROM_HAND",
        player,
        handUid: payloadString(payload, "handUid"),
      };
    case "ACTIVATE_CHARACTER":
      return { type: "ACTIVATE_CHARACTER", player, uid: payloadString(payload, "uid") };
    case "LEADER_EFFECT":
      return { type: "LEADER_EFFECT", player };
    case "RECOVERY":
      return { type: "RECOVERY", player };
    case "DECLARE_ATTACK": {
      const attackerKind = payload.attackerKind;
      if (attackerKind !== "leader" && attackerKind !== "character") {
        throw new Error('Naruto DECLARE_ATTACK payload requires "attackerKind" leader|character.');
      }
      const targetKind = payload.targetKind;
      if (targetKind !== "leader" && targetKind !== "character") {
        throw new Error('Naruto DECLARE_ATTACK payload requires "targetKind" leader|character.');
      }
      const targetUid = payload.targetUid;
      if (targetUid !== null && targetUid !== undefined && typeof targetUid !== "string") {
        throw new Error('Naruto DECLARE_ATTACK payload "targetUid" must be a string or null.');
      }
      return {
        type: "DECLARE_ATTACK",
        player,
        attackerUid: payloadString(payload, "attackerUid"),
        attackerKind: attackerKind as AttackerKind,
        targetKind: targetKind as TargetKind,
        targetUid: typeof targetUid === "string" ? targetUid : null,
      };
    }
    case "PASS_COUNTER":
      return { type: "PASS_COUNTER", player };
    case "RESOLVE_CHOICE": {
      const key = payload.key;
      if (key !== null && key !== undefined && typeof key !== "string") {
        throw new Error('Naruto RESOLVE_CHOICE payload "key" must be a string or null.');
      }
      return { type: "RESOLVE_CHOICE", player, key: typeof key === "string" ? key : null };
    }
    case "END_TURN":
      return { type: "END_TURN", player };
    default:
      throw new Error(
        `Unknown Naruto move type "${moveType}". Expected one of: ${NARUTO_ACTION_TYPES.join(", ")}.`,
      );
  }
}

/** Flat payload form of a native action (used for move records/bot dispatch). */
function actionToPayload(action: Action): Record<string, unknown> {
  switch (action.type) {
    case "MULLIGAN":
      return { keep: action.keep };
    case "SUMMON":
    case "SET_SUPPORT":
    case "ACTIVATE_SUPPORT_FROM_HAND":
      return { handUid: action.handUid };
    case "ACTIVATE_SUPPORT":
      return { slot: action.slot };
    case "ACTIVATE_CHARACTER":
      return { uid: action.uid };
    case "DECLARE_ATTACK":
      return {
        attackerUid: action.attackerUid,
        attackerKind: action.attackerKind,
        targetKind: action.targetKind,
        targetUid: action.targetUid,
      };
    case "RESOLVE_CHOICE":
      return { key: action.key };
    case "LEADER_EFFECT":
    case "RECOVERY":
    case "PASS_COUNTER":
    case "END_TURN":
      return {};
  }
}

function payloadString(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Naruto action payload requires a non-empty string "${key}".`);
  }
  return value;
}

function payloadBoolean(payload: Record<string, unknown>, key: string): boolean {
  const value = payload[key];
  if (typeof value !== "boolean") {
    throw new Error(`Naruto action payload requires a boolean "${key}".`);
  }
  return value;
}

// ---------------------------------------------------------------------------
// Adapter lifecycle hooks
// ---------------------------------------------------------------------------

/**
 * Create a fresh {@link NarutoServerEngine} from the play module's generic
 * create-input. Each player's `cardsMaps` entries are split into the leader
 * (exactly one card with `cardType === "leader"`) and the 50-card main deck.
 */
export async function narutoCreateServerEngine(
  input: ServerEngineCreateInput,
): Promise<ServerGameEngine> {
  if (input.timeControl && input.timeControl.mode !== "none") {
    throw new Error(
      `Naruto adapter does not support time-control mode "${input.timeControl.mode}". ` +
        `Only "none" is currently implemented.`,
    );
  }

  const decks = [input.player1Id, input.player2Id].map((playerId) => {
    const instanceIds = input.cardsMaps.owners[playerId] ?? [];
    let leaderId: string | null = null;
    const cardIds: string[] = [];
    for (const instanceId of instanceIds) {
      const cardId = input.cardsMaps.cardInstances[instanceId];
      if (!cardId) continue;
      const card = getCardById(cardId);
      if (card?.cardType === "leader") {
        if (leaderId !== null && leaderId !== cardId) {
          throw new Error(`Naruto deck for ${playerId} contains more than one leader.`);
        }
        leaderId = cardId;
      } else {
        cardIds.push(cardId);
      }
    }
    if (leaderId === null) {
      throw new Error(`Naruto deck for ${playerId} does not contain a leader card.`);
    }
    return { leaderId, cardIds };
  });

  const p1Deck = decks[0];
  const p2Deck = decks[1];
  if (!p1Deck || !p2Deck) {
    throw new Error("Naruto adapter requires exactly two seated players.");
  }

  const state = createInitialState({
    decks: {
      p1: { leaderId: p1Deck.leaderId, cardIds: p1Deck.cardIds },
      p2: { leaderId: p2Deck.leaderId, cardIds: p2Deck.cardIds },
    },
    seed: hashSeed(input.seed),
    names: { p1: input.player1Id, p2: input.player2Id },
  });
  return new NarutoServerEngine({
    state,
    seats: { p1: input.player1Id, p2: input.player2Id },
  });
}

/** Build the persistence envelope from a Naruto engine. */
export function narutoSerializeEngine(
  engine: ServerGameEngine,
  cardsMaps: CardsMaps,
): EngineSnapshot {
  const naruto = unwrap(engine);
  return {
    gameSlug: "naruto",
    state: toSnapshotState({
      state: naruto.getRawState(),
      stateVersion: naruto.getStateID(),
      seats: naruto.seats,
    }),
    historyLength: 0,
    cardsMaps,
  };
}

/**
 * Recreate a Naruto engine from a previously serialised snapshot. Re-wraps
 * the persisted payload directly so the CAS version counter continues from
 * where the snapshot was taken.
 */
export async function narutoRestoreEngine(
  snapshot: EngineSnapshot,
  _context: ServerEngineRestoreContext,
): Promise<ServerGameEngine> {
  const parsed = parseSnapshotState(snapshot.state);
  return new NarutoServerEngine({
    state: parsed.state,
    seats: parsed.seats,
    stateVersion: parsed.stateVersion,
  });
}

/** Naruto implementation of {@link import("@tcg/shared/game-adapter").GameAdapter.extractCardsMapsFromSnapshot}. */
export function narutoExtractCardsMapsFromSnapshot(snapshot: EngineSnapshot): CardsMaps {
  return snapshot.cardsMaps ?? { cardInstances: {}, owners: {} };
}

function unwrap(engine: ServerGameEngine): NarutoServerEngine {
  if (engine instanceof NarutoServerEngine) return engine;
  throw new Error(
    "Naruto adapter received a ServerGameEngine that is not a NarutoServerEngine. " +
      "This indicates a wiring bug in the game-server.",
  );
}

/** Deterministic FNV-1a fold of the platform string seed into the engine's numeric seed. */
function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
