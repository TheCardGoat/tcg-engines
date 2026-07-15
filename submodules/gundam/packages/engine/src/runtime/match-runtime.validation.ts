/**
 * Command validation for the match runtime.
 * Validates that a command is legal before execution.
 */

import type { CommandEnvelope } from "../types/command.ts";
import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";
import type { DeepReadonly, MoveValidationResult } from "../types/move-types.ts";
import type { FlowDefinition } from "../types/flow-types.ts";

import { getGundamMoveDefinition, isGundamMoveName } from "../gundam/moves/move-name.ts";
import { gundamFlow } from "../gundam/flow.ts";
import type { GundamG } from "../gundam/types.ts";

function validateArgsShape(args: unknown): MoveValidationResult {
  if (args === undefined) {
    return {
      valid: false,
      error: "Move args are required",
      errorCode: "MISSING_ARGS",
    };
  }

  if (args === null || typeof args !== "object" || Array.isArray(args)) {
    return {
      valid: false,
      error: "Move args must be a non-null object",
      errorCode: "INVALID_ARGS",
    };
  }

  return { valid: true };
}

/**
 * Get the set of valid move names for the current flow position.
 */
function getFlowValidMoves(state: MatchState, flow: FlowDefinition): Set<string> | null {
  const { status } = state.ctx;
  const segmentId = status.gameSegment;
  if (!segmentId) return null;

  const segment = flow.gameSegments[segmentId];
  if (!segment) return null;

  // Collect valid moves from segment, phase, and step (most specific wins)
  const validMoves = new Set<string>();

  // Segment-level valid moves
  if (segment.validMoves) {
    for (const m of segment.validMoves) validMoves.add(m);
  }

  // Turn-level valid moves
  if (segment.turn.validMoves) {
    for (const m of segment.turn.validMoves) validMoves.add(m);
  }

  // Phase-level valid moves
  const phaseId = status.phase;
  if (phaseId) {
    const phase = segment.turn.phases[phaseId];
    if (phase?.validMoves) {
      for (const m of phase.validMoves) validMoves.add(m);
    }

    // Step-level valid moves
    const stepId = status.step;
    if (stepId && phase?.steps) {
      const step = phase.steps[stepId];
      if (step?.validMoves) {
        for (const m of step.validMoves) validMoves.add(m);
      }
    }
  }

  // If no validMoves arrays were defined at any level, return null (all moves allowed)
  if (
    !segment.validMoves &&
    !segment.turn.validMoves &&
    (!phaseId || !segment.turn.phases[phaseId]?.validMoves)
  ) {
    return null;
  }

  return validMoves;
}

/**
 * Validate a command envelope against the current match state.
 *
 * Checks:
 * 1. Move exists in gundamMoves
 * 2. State ID matches (unless ignoreStaleStateID)
 * 3. Player is the active player (unless move.ignoreActivePlayer)
 * 4. Move is valid in current phase (check gundamFlow.validMoves)
 * 5. Call move.validate() if present
 */
export function validateCommand(
  envelope: CommandEnvelope,
  playerId: PlayerId,
  state: MatchState,
): MoveValidationResult {
  const { move } = envelope;

  // 1. Move exists. Narrow with `isGundamMoveName` so the typed registry
  // lookup is exhaustive and unknown moves still fail with `UNKNOWN_MOVE`
  // (rather than throwing on the implicit-any index access).
  if (!isGundamMoveName(move)) {
    return {
      valid: false,
      error: `Unknown move: ${move}`,
      errorCode: "UNKNOWN_MOVE",
    };
  }
  const moveDef = getGundamMoveDefinition(move);

  const argsShape = validateArgsShape(envelope.args);
  if (!argsShape.valid) return argsShape;

  // Game already ended
  if (state.ctx.status.gameEnded) {
    return {
      valid: false,
      error: "Game has already ended",
      errorCode: "GAME_ENDED",
    };
  }

  // 2. State ID matches (stale-state rejection)
  if (!moveDef.ignoreStaleStateID && envelope.prevStateID !== state.ctx._stateID) {
    return {
      valid: false,
      error: `Command targets stale state (expected ${state.ctx._stateID}, got ${envelope.prevStateID})`,
      errorCode: "STALE_STATE",
    };
  }

  // 3. Actor role check: spectators cannot execute commands; judges bypass active-player
  if (envelope.actorRole === "spectator") {
    return {
      valid: false,
      error: "Spectators cannot execute commands",
      errorCode: "NOT_ACTIVE_PLAYER",
    };
  }

  // 4. Active player check (judges bypass)
  if (!moveDef.ignoreActivePlayer && envelope.actorRole !== "judge") {
    const { activePlayer } = state.ctx.status;
    if (activePlayer !== playerId) {
      return {
        valid: false,
        error: `Player ${playerId} is not the active player (active: ${activePlayer})`,
        errorCode: "NOT_ACTIVE_PLAYER",
      };
    }
  }

  // 4. Flow position check
  const flowValidMoves = getFlowValidMoves(state, gundamFlow);
  if (flowValidMoves !== null && !flowValidMoves.has(move)) {
    return {
      valid: false,
      error: `Move "${move}" is not valid in the current phase/step`,
      errorCode: "INVALID_FLOW_POSITION",
    };
  }

  // 4b. Pending-effect gate (rule 5-2 / 10-1-6). Moves declaring
  // `gatedByPendingEffects: true` are rejected uniformly while the
  // pending-effect queue is non-empty — the move's own `validate` no
  // longer needs to repeat the check. The shape lookup stays decoupled
  // from the Gundam-specific G type so the framework remains generic.
  if (moveDef.gatedByPendingEffects) {
    const pending = (state.G as { pendingEffects?: readonly unknown[] }).pendingEffects;
    if ((pending?.length ?? 0) > 0) {
      return {
        valid: false,
        error: "Resolve the pending effect before submitting this move",
        errorCode: "EFFECT_PENDING",
      };
    }
  }

  // 5. Move-level validate() in preflight mode (framework/cards are unavailable here)
  if (moveDef.validate) {
    const result = moveDef.validate({
      G: state.G as DeepReadonly<GundamG>,
      playerId,
      args: envelope.args,
      params: envelope.args,
      validationMode: "preflight",
      cards: null as never,
      framework: null as never,
    });
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}
