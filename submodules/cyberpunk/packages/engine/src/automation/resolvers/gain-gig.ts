import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { GainGigChoicePrompt } from "../../view/player-prompt.ts";

/**
 * Default gainGig resolver: pick the first allowed die. The pending choice
 * already filters out d20 unless it's the only die left, so picking the first
 * id is always rules-faithful.
 */
export const gainGigResolver: ChoiceResolver<GainGigChoicePrompt> = (choice): MoveDecision => {
  const dieId = choice.payload.allowedDieIds[0];
  if (!dieId) {
    return { kind: "stuck", reason: "gainGig: no allowed die" };
  }
  return { kind: "command", move: "gainGig", args: { dieId } };
};
