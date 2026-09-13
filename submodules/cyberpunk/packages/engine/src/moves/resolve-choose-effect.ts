import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ChooseEffectPendingChoice } from "../types/match-state.ts";
import type { ResolutionContext } from "../effects/target-resolver.ts";
import { executeAbilityEffects, resumeCurrentTrigger } from "../ability-executor.ts";
import { resumeSuspendedEndTurn } from "./pass-phase.ts";

export interface ResolveChooseEffectInput extends MoveInput {
  args: {
    optionId: string;
  };
}

export const resolveChooseEffectMove: MoveDefinition<ResolveChooseEffectInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    return choice?.type === "chooseEffect" && (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseEffect") {
      return { valid: false, error: "No chooseEffect pending", errorCode: "NO_PENDING_CHOICE" };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    const option = choice.payload.options.find((o) => o.id === input.args.optionId);
    if (!option) {
      return { valid: false, error: "Invalid option", errorCode: "INVALID_CHOICE" };
    }
    return { valid: true };
  },

  execute({ state, operations, input }) {
    const choice = state.G.turnMetadata.pendingChoice as ChooseEffectPendingChoice;
    const option = choice.payload.options.find((o) => o.id === input.args.optionId);
    operations.game.setPendingChoice(undefined);
    if (!option) {
      resumeCurrentTrigger(state, operations);
      resumeSuspendedEndTurn(state, operations);
      return;
    }

    const ctx: ResolutionContext = {
      state,
      sourceCardId: choice.payload.sourceCardId,
      sourcePlayerId: choice.payload.sourcePlayerId,
      abilityIndex: choice.payload.abilityIndex,
      contextTargets: choice.payload.contextTargets,
      boundTargets: choice.payload.boundTargets,
    };
    // Nested: option multi-effect bodies keep their own resume frame so a mid-body
    // target suspend does not clobber the outer ability nextEffectIndex.
    const status = executeAbilityEffects(option.effects, ctx, operations, 0, { nested: true });
    if (status === "suspended") return;
    resumeCurrentTrigger(state, operations);
    resumeSuspendedEndTurn(state, operations);
  },
};
