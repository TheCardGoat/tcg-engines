import { m } from "$lib/i18n/messages.js";
import { getLogger } from "@logtape/logtape";
import type { CommandResult } from "@tcg/lorcana-engine";
import type { LorcanaEngineBase } from "@tcg/lorcana-engine";
import { trackException } from "$lib/analytics/analytics.js";
import type {
  LorcanaSimulatorMoveId,
  LorcanaSimulatorMoveParams,
  SimulatorMoveError,
} from "@/features/simulator/model/contracts.js";

const logger = getLogger(["tcg", "move-dispatch"]);

export function dispatchSimulatorMove<K extends LorcanaSimulatorMoveId>(
  engine: LorcanaEngineBase,
  playerId: string,
  moveId: K,
  params: LorcanaSimulatorMoveParams[K],
): CommandResult {
  logger.trace("Client dispatching move {moveId} player={playerId} params={params}", {
    moveId,
    playerId,
    params,
  });
  const result = engine.dispatch(moveId, playerId, params as Record<string, unknown>);
  if (result.success) {
    logger.trace("Client move {moveId} OK player={playerId} stateID={stateID}", {
      moveId,
      playerId,
      stateID: result.stateID,
    });
  } else {
    logger.trace("Client move {moveId} FAILED player={playerId} code={errorCode} error={error}", {
      moveId,
      playerId,
      errorCode: result.errorCode,
      error: result.error,
    });
    trackException({
      source: "move_dispatch",
      code: result.errorCode ?? "MOVE_FAILED",
      message: result.error ? `${moveId}: ${result.error}` : moveId,
      fatal: false,
    });
  }
  return result;
}

export function buildPendingMoveError(
  moveId: LorcanaSimulatorMoveId,
  params: Record<string, unknown>,
  reason?: string,
  code?: string,
): SimulatorMoveError {
  const normalizedReason = reason?.trim() ?? "";
  const lowerReason = normalizedReason.toLowerCase();

  let message = m["sim.errors.moveCannotExecute"]({});
  if (
    lowerReason.includes("candidate list") ||
    lowerReason.includes("no longer available") ||
    lowerReason.includes("not currently available")
  ) {
    message = m["sim.errors.execution.moveNoLongerLegal"]({});
  } else if (code === "INVALID_MOVE") {
    message = m["sim.errors.execution.invalidMove"]({});
  }

  return {
    code,
    message,
    moveId,
    params,
    rawReason: normalizedReason || undefined,
  };
}
