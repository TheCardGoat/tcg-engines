import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ChooseSacrificialGearChoicePrompt } from "../../view/player-prompt.ts";

/** Bots apply the first legal mandatory Deadman-style replacement. */
export const chooseSacrificialGearResolver: ChoiceResolver<ChooseSacrificialGearChoicePrompt> = (
  choice,
): MoveDecision => {
  const cardId = choice.payload.gearIds[0];
  if (!cardId) {
    return { kind: "stuck", reason: "chooseSacrificialGear: no attached Gear" };
  }
  return {
    kind: "command",
    move: "resolveSacrificialGear",
    args: { cardId },
  };
};
