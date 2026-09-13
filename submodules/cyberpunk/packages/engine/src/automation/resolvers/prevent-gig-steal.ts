import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { PreventGigStealChoicePrompt } from "../../view/player-prompt.ts";

/**
 * Bots do not yet reason about gig-theft prevention; they decline the option so
 * the steal resolves normally. Human players (and explicit test-engine calls)
 * resolve `preventGigSteal` choices directly via the `resolvePreventGigSteal`
 * move.
 */
export const preventGigStealResolver: ChoiceResolver<
  PreventGigStealChoicePrompt
> = (): MoveDecision => {
  return {
    kind: "command",
    move: "resolvePreventGigSteal",
    args: { pass: true, preventions: [] },
  };
};
