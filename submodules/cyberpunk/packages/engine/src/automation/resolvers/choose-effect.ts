import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ChooseEffectChoicePrompt } from "../../view/player-prompt.ts";

/**
 * Default `chooseEffect` resolver.
 *
 * Picks the first offered option. Modal cards that need smarter scoring can
 * override this resolver; for Pyramid Song the gated "both" option is the only
 * offer when a friendly d4 is min, otherwise the first single-effect option.
 * Returning `stuck` when the payload is empty surfaces accidental empty emits.
 */
export const chooseEffectResolver: ChoiceResolver<ChooseEffectChoicePrompt> = (
  choice,
): MoveDecision => {
  const options = choice.payload.options;
  if (options.length === 0) {
    return {
      kind: "stuck",
      reason: "chooseEffect: emitted with no options — engine bug",
    };
  }
  return {
    kind: "command",
    move: "resolveChooseEffect",
    args: { optionId: options[0]!.id },
  };
};
