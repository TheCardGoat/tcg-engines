/**
 * MatchRuntime Validation
 *
 * Command validation logic — pure function, no class dependencies.
 */

import type { MatchState, MoveInput } from "./types";
import type {
  MatchRuntimeConfig,
  MoveDefinition,
  MoveValidationContext,
  RuntimeActorRole,
  RuntimeFlowDefinition,
} from "./match-runtime.types";
import { isMoveAllowedByFlow, getFlowDisallowReason } from "./match-runtime.flow";
import { canPlayerTakeActions } from "./match-runtime.apis";
import { buildValidationContext as buildValidationContextFromUtils } from "./match-runtime.utils";
import type { MatchStaticResources } from "./static-resources";
import type { BaseCardDefinition } from "./card-contracts";
import type { LorcanaG } from "../../types/runtime-state";

export interface ValidationContext {
  state: MatchState;
  config: MatchRuntimeConfig;
  staticResources: MatchStaticResources;
  actorRole: RuntimeActorRole;
  gameEnded: boolean;
  currentStateID: number;
}

export function validateCommand(
  command: { move: string; input?: MoveInput },
  playerId: string,
  prevStateID: number,
  ctx: ValidationContext,
): {
  valid: boolean;
  reason?: string;
  code?: string;
  moveDef?: MoveDefinition;
  actingPlayerId?: string;
} {
  const commandInput = command.input;
  if (!commandInput) {
    return {
      valid: false,
      reason: "Move input was not provided",
      code: "MISSING_INPUT",
    };
  }

  if (prevStateID !== ctx.currentStateID) {
    return {
      valid: false,
      reason: "State ID mismatch - client state is stale",
      code: "STALE_STATE",
    };
  }

  if (ctx.gameEnded || ctx.state.ctx.status.gameEnded) {
    return { valid: false, reason: "Game has already ended", code: "GAME_ENDED" };
  }

  const moveDef = ctx.config.moves[command.move];
  if (!moveDef) {
    return {
      valid: false,
      reason: `Move '${command.move}' not found`,
      code: "MOVE_NOT_FOUND",
    };
  }

  if (moveDef.serverOnly && ctx.actorRole === "player") {
    return {
      valid: false,
      reason: `Move '${command.move}' is server-only`,
      code: "SERVER_ONLY",
    };
  }

  const flow = ctx.config.flow as RuntimeFlowDefinition | undefined;

  if (
    !isMoveAllowedByFlow(
      flow,
      ctx.state.ctx.status.phase,
      command.move,
      ctx.state.ctx.status.gameSegment,
    )
  ) {
    return {
      valid: false,
      reason: getFlowDisallowReason(
        flow,
        ctx.state.ctx.status.phase,
        command.move,
        ctx.state.ctx.status.gameSegment,
      ),
      code: "FLOW_DISALLOWED",
    };
  }

  const inferActingPlayerId = (): string | undefined => {
    if (ctx.actorRole === "player") return playerId;
    return ctx.state.ctx.priority.holder ?? ctx.state.ctx.playerIds[0];
  };

  if (!moveDef.serverOnly) {
    const actingPlayerId = inferActingPlayerId();

    if (!actingPlayerId) {
      return {
        valid: false,
        reason: "Non-server-only moves require an explicit acting player",
        code: "ACTING_PLAYER_REQUIRED",
      };
    }

    if (!moveDef.ignorePriority && !canPlayerTakeActions(ctx.state, actingPlayerId)) {
      return {
        valid: false,
        reason: `Player '${actingPlayerId}' does not currently have priority`,
        code: "NOT_PRIORITY_HOLDER",
      };
    }

    if (!moveDef.validate) {
      return { valid: true, moveDef, actingPlayerId };
    }

    const validationContext = buildValidationContextFromUtils({
      state: ctx.state,
      playerId: actingPlayerId,
      input: commandInput,
      config: ctx.config,
      staticResources: ctx.staticResources,
      gameEnded: ctx.gameEnded,
      validationMode: "final",
    });
    const validation = moveDef.validate(validationContext);
    if (!validation.valid) {
      return {
        valid: false,
        reason: validation.error,
        code: validation.errorCode || "VALIDATION_FAILED",
      };
    }

    return { valid: true, moveDef, actingPlayerId };
  }

  if (!moveDef.validate) {
    return { valid: true, moveDef, actingPlayerId: playerId };
  }

  const validation = moveDef.validate(
    buildValidationContextFromUtils({
      state: ctx.state,
      playerId,
      input: commandInput,
      config: ctx.config,
      staticResources: ctx.staticResources,
      gameEnded: ctx.gameEnded,
      validationMode: "final",
    }),
  );
  if (!validation.valid) {
    return {
      valid: false,
      reason: validation.error,
      code: validation.errorCode || "VALIDATION_FAILED",
    };
  }

  return { valid: true, moveDef, actingPlayerId: playerId };
}
