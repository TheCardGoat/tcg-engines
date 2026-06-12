import type { GigDieId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseTargetPendingChoice } from "../types/match-state.ts";
import { DIE_MAX_VALUES } from "../types/gig-die.ts";
import { resumeCurrentTrigger } from "../ability-executor.ts";

export interface ResolveAdjustGigInput extends MoveInput {
  args: {
    value: number;
  };
}

/**
 * Resolves a `chooseTarget / adjustGig` pending choice by setting the targeted
 * die to `value`. Validates that the requested value respects the effect's
 * direction (`increase` / `decrease` / `either`), the `maxAmount` distance
 * from the die's current face, and the die's natural face range (1..max).
 */
export const resolveAdjustGigMove: MoveDefinition<ResolveAdjustGigInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") return false;
    const typed = choice as ChooseTargetPendingChoice;
    if (typed.payload.type !== "adjustGig") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") {
      return { valid: false, error: "No chooseTarget pending", errorCode: "NO_PENDING_CHOICE" };
    }
    const typed = choice as ChooseTargetPendingChoice;
    if (typed.payload.type !== "adjustGig") {
      return {
        valid: false,
        error: "Pending choice is not adjustGig",
        errorCode: "WRONG_PENDING_CHOICE",
      };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }

    const dieId = typed.payload.dieId;
    const die = dieId ? state.G.gigDice[dieId as string] : undefined;
    if (!die) {
      return { valid: false, error: "Target die not found", errorCode: "DIE_NOT_FOUND" };
    }

    const { value } = input.args;
    if (!Number.isInteger(value)) {
      return { valid: false, error: "Value must be an integer", errorCode: "INVALID_VALUE" };
    }
    const maxFace = DIE_MAX_VALUES[die.dieType];
    if (value < 1 || value > maxFace) {
      return {
        valid: false,
        error: `Value must be between 1 and ${maxFace}`,
        errorCode: "VALUE_OUT_OF_RANGE",
      };
    }

    const delta = value - die.faceValue;
    const direction = typed.payload.direction;
    if (direction === "increase" && delta < 0) {
      return { valid: false, error: "Direction is increase", errorCode: "WRONG_DIRECTION" };
    }
    if (direction === "decrease" && delta > 0) {
      return { valid: false, error: "Direction is decrease", errorCode: "WRONG_DIRECTION" };
    }

    const maxAmount = typed.payload.maxAmount ?? 0;
    if (Math.abs(delta) > maxAmount) {
      return {
        valid: false,
        error: `Adjustment exceeds maxAmount (${maxAmount})`,
        errorCode: "EXCEEDS_MAX_AMOUNT",
      };
    }

    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice as ChooseTargetPendingChoice;
    const dieId = choice.payload.dieId as GigDieId;
    const die = state.G.gigDice[dieId as string];
    const previousValue = die?.faceValue;
    operations.gig.setGigValue(dieId, input.args.value);
    operations.game.setPendingChoice(undefined);
    operations.event.emit({
      type: "actionLog",
      messageKey: "move.resolveAdjustGig",
      params: {
        value: input.args.value,
        previousValue: previousValue ?? input.args.value,
        dieId: dieId as string,
        dieLabel: die?.dieType.toUpperCase() ?? "Gig",
      },
      playerId,
    });
    resumeCurrentTrigger(state, operations);
  },
};
