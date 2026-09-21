import type { GigDieId } from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseTargetPendingChoice } from "../types/match-state.ts";
import { DIE_MAX_VALUES } from "../types/gig-die.ts";
import {
  continueTriggerResolution,
  enqueueEventTriggers,
  resumeCurrentTrigger,
} from "../ability-executor.ts";
import { resumeSuspendedEndTurn } from "./pass-phase.ts";
import { buildEffectTargetActionLogDetails } from "../logging/effect-target.ts";

export interface ResolveAdjustGigInput extends MoveInput {
  args: { kind: "adjust"; dieId: GigDieId; value: number } | { kind: "noAdjustment" };
}

function isAtomicTargetChoice(choice: ChooseTargetPendingChoice): boolean {
  return choice.payload.type === "effectTarget" && choice.payload.adjustGig !== undefined;
}

function isAdjustGigChoice(choice: ChooseTargetPendingChoice): boolean {
  return choice.payload.type === "adjustGig" || isAtomicTargetChoice(choice);
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
    if (!isAdjustGigChoice(typed)) return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") {
      return { valid: false, error: "No chooseTarget pending", errorCode: "NO_PENDING_CHOICE" };
    }
    const typed = choice as ChooseTargetPendingChoice;
    if (!isAdjustGigChoice(typed)) {
      return {
        valid: false,
        error: "Pending choice is not adjustGig",
        errorCode: "WRONG_PENDING_CHOICE",
      };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }

    if (input.args.kind === "noAdjustment") {
      const canDecline =
        typed.payload.type === "effectTarget"
          ? typed.payload.canDecline === true ||
            (typed.payload.min ?? 1) === 0 ||
            typed.payload.adjustGig?.chooseUpTo === true
          : typed.payload.chooseUpTo === true;
      return canDecline
        ? { valid: true }
        : {
            valid: false,
            error: "This Gig adjustment cannot be declined",
            errorCode: "CANNOT_PASS",
          };
    }

    const dieId = input.args.dieId;
    if (typed.payload.type === "effectTarget") {
      if (!(typed.payload.eligibleIds ?? []).includes(dieId as string)) {
        return { valid: false, error: "Gig is not a valid choice", errorCode: "INVALID_CHOICE" };
      }
    } else if (typed.payload.dieId !== dieId) {
      return {
        valid: false,
        error: "Gig does not match the pending choice",
        errorCode: "INVALID_CHOICE",
      };
    }
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
    const adjustment =
      typed.payload.type === "effectTarget" ? typed.payload.adjustGig : typed.payload;
    if (delta === 0) {
      return {
        valid: false,
        error: "Use noAdjustment instead of setting a Gig to its current value",
        errorCode: "SAME_VALUE",
      };
    }
    const direction = adjustment?.direction;
    if (direction === "increase" && delta < 0) {
      return { valid: false, error: "Direction is increase", errorCode: "WRONG_DIRECTION" };
    }
    if (direction === "decrease" && delta > 0) {
      return { valid: false, error: "Direction is decrease", errorCode: "WRONG_DIRECTION" };
    }

    const maxAmount = adjustment?.maxAmount ?? 0;
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
    const atomicTargetChoice = isAtomicTargetChoice(choice);
    const current = state.G.turnMetadata.currentTrigger;

    if (input.args.kind === "noAdjustment") {
      if (atomicTargetChoice && choice.payload.selectedBindingId && current) {
        current.boundTargets[choice.payload.selectedBindingId] = [];
        const effectIndex = choice.payload.adjustGig?.effectIndex;
        if (effectIndex !== undefined) current.nextEffectIndex = effectIndex + 1;
      }
      operations.game.setPendingChoice(undefined);
      continueTriggerResolution(state, operations);
      resumeCurrentTrigger(state, operations);
      resumeSuspendedEndTurn(state, operations);
      return;
    }

    const dieId = input.args.dieId;
    const die = state.G.gigDice[dieId as string];
    const previousValue = die?.faceValue;

    if (atomicTargetChoice && choice.payload.selectedBindingId && current) {
      current.boundTargets[choice.payload.selectedBindingId] = [dieId as string];
      const effectIndex = choice.payload.adjustGig?.effectIndex;
      if (effectIndex !== undefined) current.nextEffectIndex = effectIndex + 1;
      if (choice.payload.sourceCardId) {
        const actionLog = buildEffectTargetActionLogDetails(
          state,
          choice.payload.sourceCardId,
          [dieId as string],
          playerId,
        );
        operations.event.emit({
          type: "effectTargeted",
          sourceCardId: choice.payload.sourceCardId,
          targets: [{ kind: "gig", dieId }],
          playerId,
        });
        operations.event.emit({
          type: "actionLog",
          messageKey: "trigger.targetResolved",
          params: actionLog.params,
          playerId,
          category: "trigger",
          cardIds: actionLog.cardIds,
        });
      }
    }
    const eventsBefore = operations.event.getEmittedEvents().length;
    operations.gig.setGigValue(dieId, input.args.value);
    if (state.G.turnMetadata.currentTrigger && previousValue !== undefined) {
      state.G.turnMetadata.currentTrigger.lastGigAdjustment = {
        dieId,
        previousValue,
        newValue: input.args.value,
      };
    }
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
    for (const emitted of operations.event.getEmittedEvents().slice(eventsBefore)) {
      if (emitted.type === "gigValueChanged") {
        enqueueEventTriggers(emitted, state, operations);
      }
    }
    continueTriggerResolution(state, operations);
    resumeCurrentTrigger(state, operations);
    resumeSuspendedEndTurn(state, operations);
  },
};
