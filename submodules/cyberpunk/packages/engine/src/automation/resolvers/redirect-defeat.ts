import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { RedirectDefeatChoicePrompt } from "../../view/player-prompt.ts";

/**
 * Bots decline Jackie-style optional defeat replacements by default. Human
 * players and explicit test-engine calls resolve `redirectDefeat` via
 * `resolveRedirectDefeat`. Tactical search enumerates apply vs pass.
 */
export const redirectDefeatResolver: ChoiceResolver<
  RedirectDefeatChoicePrompt
> = (): MoveDecision => {
  return {
    kind: "command",
    move: "resolveRedirectDefeat",
    args: { pass: true },
  };
};
