import type { ChoiceResolver, MoveDecision } from "../types.ts";
import type { ChooseCardTypeChoicePrompt } from "../../view/player-prompt.ts";

export const chooseCardTypeResolver: ChoiceResolver<ChooseCardTypeChoicePrompt> = (
  choice,
): MoveDecision => {
  const cardType = choice.payload.cardTypes[0];
  if (!cardType) {
    return { kind: "stuck", reason: "chooseCardType: no card types" };
  }
  return { kind: "command", move: "resolveCardTypeChoice", args: { cardType } };
};
