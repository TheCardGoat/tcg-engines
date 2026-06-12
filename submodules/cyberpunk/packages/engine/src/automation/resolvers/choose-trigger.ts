import type { ChoiceResolver } from "../types.ts";
import type { ChooseTriggerChoicePrompt } from "../../view/player-prompt.ts";

export const chooseTriggerResolver: ChoiceResolver<ChooseTriggerChoicePrompt> = (choice) => {
  const first = choice.payload.options[0];
  if (!first) return { kind: "stuck", reason: "chooseTrigger: no trigger options" };
  return {
    kind: "command",
    move: "resolveTrigger",
    args: { triggerId: first.triggerId },
  };
};
