import { create } from "mutative";
import type {
  MatchState,
  CommandResult,
  CommandEnvelope,
  CommandSuccess,
  MoveDefinition,
} from "../types/index.ts";
import type { PlayerId } from "../types/branded.ts";
import { createOperations } from "../operations/index.ts";
import { recomputeActiveEffects } from "../active-effects/index.ts";
import type { MoveLog } from "../logging/move-log.ts";
import { synthesizeMoveLogs } from "./synthesize-move-logs.ts";
import { buildAnimationScript } from "../animation/builder.ts";
import { getEffectiveActivePlayerId } from "../state/turn-info.ts";

interface MoveRegistry {
  [moveId: string]: MoveDefinition<any>;
}

let moveRegistry: MoveRegistry = {};

export function registerMove(moveId: string, definition: MoveDefinition<any>): void {
  moveRegistry[moveId] = definition;
}

export function registerMoves(moves: MoveRegistry): void {
  moveRegistry = { ...moveRegistry, ...moves };
}

export function getMoveRegistry(): MoveRegistry {
  return moveRegistry;
}

export function enumerateMoves(state: MatchState, playerId: PlayerId): string[] {
  const available: string[] = [];
  for (const [moveId, def] of Object.entries(moveRegistry)) {
    if (state.G.turnMetadata.pendingChoice && !def.handlesPendingChoice) continue;
    if (def.available && !def.available({ state, playerId })) continue;
    available.push(moveId);
  }
  return available;
}

export function processCommand(
  state: MatchState,
  command: CommandEnvelope,
  playerId: PlayerId,
): CommandResult {
  const timestamp = command.timestamp ?? Date.now();
  const move = moveRegistry[command.move];
  if (!move) {
    return {
      success: false,
      error: `Unknown move: ${command.move}`,
      errorCode: "UNKNOWN_MOVE",
      currentStateID: state.ctx.stateID,
    };
  }

  // Global pendingChoice guard: if a player decision is outstanding, only moves
  // that explicitly declare they handle pending choices are allowed through.
  // This prevents any move from accidentally interleaving with an in-progress choice.
  if (state.G.turnMetadata.pendingChoice && !move.handlesPendingChoice) {
    return {
      success: false,
      error: "A pending choice must be resolved first",
      errorCode: "PENDING_CHOICE_REQUIRED",
      currentStateID: state.ctx.stateID,
    };
  }

  if (move.validate) {
    const result = move.validate({
      state,
      playerId,
      input: command.input ?? { args: {} },
    });
    if (!result.valid) {
      return {
        success: false,
        error: result.error ?? "Validation failed",
        errorCode: result.errorCode ?? "VALIDATION_FAILED",
        currentStateID: state.ctx.stateID,
      };
    }
  }

  const events: import("../types/game-events.ts").GameEvent[] = [];
  const logs: MoveLog[] = [];

  const previousEffectiveActivePlayer = getEffectiveActivePlayerId(state);
  const previousPhase = state.G.gamePhase;
  const [newState, patches, inversePatches] = create(
    state,
    (draft) => {
      const ops = createOperations(draft.G, events, logs);

      move.execute({
        state: draft as MatchState,
        playerId,
        input: command.input ?? { args: {} },
        operations: ops,
      });

      // Rebuild static active effects once per command, after the move completes.
      //
      // Design note — stale snapshot during a move:
      // Triggered abilities and resolveTarget calls that happen *inside* move.execute
      // (via processEventTriggers) evaluate against the activeEffects table from the
      // start of the move, not from any mutations the move has already made. This means
      // that if a card enters the field mid-move via a triggered ability, its static
      // abilities (e.g. "+3 power to all friendly units") are not visible to subsequent
      // condition checks in the same move.
      //
      // This is intentional. Calling recomputeActiveEffects before every trigger
      // evaluation would add up to 5 fixed-point passes per trigger, and the current
      // card set has no gameplay interaction that depends on intra-move static
      // recomputation. If that changes, the fix is to call recomputeActiveEffects once
      // at the top of processEventTriggers (ability-executor.ts) rather than per-trigger.
      recomputeActiveEffects(draft as MatchState);
      applyDynamicClockAfterCommand({
        state: draft as MatchState,
        actorId: playerId,
        previousActivePlayerId: previousEffectiveActivePlayer,
        previousPhase,
        moveId: command.move,
        timestamp,
      });
      draft.ctx.stateID++;
    },
    {
      enablePatches: true,
    },
  );

  const moveLogs = synthesizeMoveLogs({
    explicitLogs: logs,
    events,
    playerId,
    moveId: command.move,
    state: newState as MatchState,
  });

  const undoable = move.undoable !== false;

  const animationScript = buildAnimationScript(events);

  const result: CommandSuccess = {
    success: true,
    stateID: newState.ctx.stateID,
    state: newState as MatchState,
    patches: patches ?? [],
    inversePatches: inversePatches ?? [],
    gameEvents: events,
    moveLogs,
    animationScript,
    processedCommand: command,
    undoable,
  };

  return result;
}

function applyDynamicClockAfterCommand(input: {
  state: MatchState;
  actorId: PlayerId;
  previousActivePlayerId: PlayerId | undefined;
  previousPhase: MatchState["G"]["gamePhase"];
  moveId: string;
  timestamp: number;
}): void {
  const timeControl = input.state.ctx.timeControl;
  const clockState = input.state.ctx.clockState;
  if (!timeControl || timeControl.mode !== "dynamic" || !clockState) return;

  const config = timeControl.config;
  const previousActiveClock = input.previousActivePlayerId
    ? clockState[input.previousActivePlayerId as string]
    : undefined;

  if (previousActiveClock) {
    const elapsedMs = Math.max(0, input.timestamp - previousActiveClock.lastUpdatedAtMs);
    previousActiveClock.reserveMsRemaining -= elapsedMs;
    previousActiveClock.totalConsumedMs += elapsedMs;
    previousActiveClock.lastUpdatedAtMs = input.timestamp;
    previousActiveClock.isOnClock = false;
  }

  const actorClock = clockState[input.actorId as string];
  if (actorClock) {
    const actionBonus = config.perActionBonusMs ?? 0;
    const turnPassBonus =
      input.moveId === "passPhase" && input.previousPhase === "main"
        ? (config.perTurnPassBonusMs ?? 0)
        : 0;
    const bonus = actionBonus + turnPassBonus;
    const cap = config.reserveCapMs ?? config.initialReserveMs;

    actorClock.reserveMsRemaining = Math.min(cap, actorClock.reserveMsRemaining + bonus);
    actorClock.movesMade += 1;
    actorClock.actionBonusMsGranted = (actorClock.actionBonusMsGranted ?? 0) + actionBonus;
    actorClock.turnPassBonusMsGranted = (actorClock.turnPassBonusMsGranted ?? 0) + turnPassBonus;
    actorClock.lastUpdatedAtMs = input.timestamp;
  }

  const nextActivePlayerId = getEffectiveActivePlayerId(input.state);
  for (const [playerId, clock] of Object.entries(clockState)) {
    clock.isOnClock = playerId === nextActivePlayerId;
    if (playerId === nextActivePlayerId) {
      clock.lastUpdatedAtMs = input.timestamp;
    }
  }
}

export function validateCommand(
  state: MatchState,
  command: CommandEnvelope,
  playerId: PlayerId,
): { valid: boolean; error?: string; code?: string } {
  const move = moveRegistry[command.move];
  if (!move) {
    return { valid: false, error: `Unknown move: ${command.move}`, code: "UNKNOWN_MOVE" };
  }

  if (state.G.turnMetadata.pendingChoice && !move.handlesPendingChoice) {
    return {
      valid: false,
      error: "A pending choice must be resolved first",
      code: "PENDING_CHOICE_REQUIRED",
    };
  }

  if (move.validate) {
    const result = move.validate({
      state,
      playerId,
      input: command.input ?? { args: {} },
    });
    if (!result.valid) {
      return { valid: false, error: result.error, code: result.errorCode };
    }
  }

  return { valid: true };
}
