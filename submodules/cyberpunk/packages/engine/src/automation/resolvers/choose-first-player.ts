import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ChooseFirstPlayerChoicePrompt } from "../../view/player-prompt.ts";

/** Random winner goes first unless a strategy overrides. */
export const chooseFirstPlayerResolver: ChoiceResolver<
  ChooseFirstPlayerChoicePrompt
> = (): MoveDecision => {
  return {
    kind: "command",
    move: "resolveFirstPlayer",
    args: { goFirst: true },
  };
};
