import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseTriggerPendingChoice } from "../types/match-state.ts";
import { passOptionalTriggers, resolveQueuedTrigger } from "../ability-executor.ts";

export interface ResolveTriggerInput extends MoveInput {
  args: {
    triggerId?: string;
    pass?: boolean;
  };
}

export const resolveTriggerMove: MoveDefinition<ResolveTriggerInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTrigger") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTrigger") {
      return { valid: false, error: "No chooseTrigger pending", errorCode: "NO_PENDING_CHOICE" };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    const typed = choice as ChooseTriggerPendingChoice;
    if (input.args.pass) {
      if (!typed.payload.canPass) {
        return {
          valid: false,
          error: "Cannot pass this trigger choice",
          errorCode: "INVALID_CHOICE",
        };
      }
      return { valid: true };
    }
    if (!input.args.triggerId) {
      return { valid: false, error: "No trigger selected", errorCode: "INVALID_CHOICE" };
    }
    if (!typed.payload.options.some((option) => option.triggerId === input.args.triggerId)) {
      return { valid: false, error: "Trigger is not a valid choice", errorCode: "INVALID_CHOICE" };
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    if (input.args.pass) {
      passOptionalTriggers(state, operations, playerId);
      return;
    }
    resolveQueuedTrigger(input.args.triggerId!, state, operations);
  },
};
