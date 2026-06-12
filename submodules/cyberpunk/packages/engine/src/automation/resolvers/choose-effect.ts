import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ChooseEffectChoicePrompt } from "../../view/player-prompt.ts";

/**
 * Default `chooseEffect` resolver.
 *
 * CONTRACT(chooseEffect): no engine code emits this variant today. The
 * payload shape (`options: ChooseEffectOption[]`) is locked so whoever
 * lands the first modal-effect card has a clear contract to satisfy:
 *
 *   1. Engine handler: emit a `chooseEffect` pending choice with
 *      `payload.options` populated from card text.
 *   2. New `resolveChooseEffect` move: input `{ optionId: string }`,
 *      validates membership and applies that option's `effects` list.
 *   3. AI resolver: replace this stub with a real heuristic that scores
 *      each option's `effects` and picks one. The current behaviour
 *      (returning the first option when one is supplied) is a sensible
 *      default that won't crash but is unlikely to be optimal play.
 *
 * Until step 1 is done, this resolver never fires in production. Returning
 * `stuck` (rather than picking) when the payload is empty surfaces any
 * accidental emit as a loud failure.
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
  // CONTRACT(chooseEffect): the first-option default ships as a placeholder.
  // Replace with a real heuristic when a modal card needs it. The engine's
  // `resolveChooseEffect` move (not yet implemented) will be the consumer.
  return {
    kind: "stuck",
    reason: `chooseEffect has no engine resolver yet (${options.length} options: ${options
      .map((o) => o.id)
      .join(", ")}) — see CONTRACT(chooseEffect)`,
  };
};
