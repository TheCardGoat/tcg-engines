import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import { abandonCurrentTrigger, isPlayerActivatedResolution } from "../ability-executor.ts";
import { resumeSuspendedEndTurn } from "./pass-phase.ts";

export type CancelPendingResolutionInput = MoveInput;

export const cancelPendingResolutionMove: MoveDefinition<CancelPendingResolutionInput> = {
  handlesPendingChoice: true,
  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    const current = state.G.turnMetadata.currentTrigger;
    if (!choice || !current) return false;
    if ((choice.chooserId as string) !== (playerId as string)) return false;
    return isPlayerActivatedResolution(current);
  },
  validate({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    const current = state.G.turnMetadata.currentTrigger;
    if (!choice || !current) {
      return {
        valid: false,
        error: "No ability resolution to cancel",
        errorCode: "NO_PENDING_CHOICE",
      };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    if (!isPlayerActivatedResolution(current)) {
      return {
        valid: false,
        error: "Only a player-activated ability can be cancelled",
        errorCode: "CANNOT_PASS",
      };
    }
    return { valid: true };
  },
  execute({ state, operations }) {
    abandonCurrentTrigger(state, operations);
    resumeSuspendedEndTurn(state, operations);
  },
};
