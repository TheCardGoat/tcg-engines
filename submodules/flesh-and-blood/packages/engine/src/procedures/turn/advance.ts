import type { FabMatchState } from "../../state.ts";
import type { FabEndTurnProcedure } from "../../rules/process.ts";
import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { handleEndPhase, handleDecay, handleBloodDebt, handleHeave } from "./stages/cleanup.ts";
import { handleTraverse, handleReturnIntimidated, handleArsenal } from "./stages/board.ts";
import { handlePitchOrder, handleReturnPitch } from "./stages/pitch.ts";
import {
  handleResetAssets,
  handleDraw,
  handleAdvanceTurn,
  handleStartPhase,
  handleActionPhase,
  handleComplete,
} from "./stages/turn.ts";

/** Continues the exact persisted turn procedure until a decision or triggered layer boundary. */
export function advanceFabEndTurnProcedure(
  state: FabMatchState,
  options: FabEventTransactionOptions,
): void {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (!process || !procedure || procedure.kind !== "end-turn" || process.stage !== "procedure")
    return;
  if (state.decision || state.rulesStack.length > 0) return;

  const endTurn: FabEndTurnProcedure = procedure;
  const ctx = { state, options, process, procedure: endTurn };
  // Capture stage as a const so exhaustive `never` is a type-level force-update
  // (mutable procedure.stage weakens switch narrowing).
  const stage = endTurn.stage;
  switch (stage) {
    case "end-phase":
      return handleEndPhase(ctx);
    case "decay":
      return handleDecay(ctx);
    case "blood-debt":
      return handleBloodDebt(ctx);
    case "heave":
      return handleHeave(ctx);
    case "traverse":
      return handleTraverse(ctx);
    case "return-intimidated":
      return handleReturnIntimidated(ctx);
    case "arsenal":
      return handleArsenal(ctx);
    case "pitch-order":
      return handlePitchOrder(ctx);
    case "return-pitch":
      return handleReturnPitch(ctx);
    case "reset-assets":
      return handleResetAssets(ctx);
    case "draw":
      return handleDraw(ctx);
    case "advance-turn":
      return handleAdvanceTurn(ctx);
    case "start-phase":
      return handleStartPhase(ctx);
    case "action-phase":
      return handleActionPhase(ctx);
    case "complete":
      return handleComplete(ctx);
    default: {
      const _exhaustive: never = stage;
      throw new Error(`Unhandled end-turn stage: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
