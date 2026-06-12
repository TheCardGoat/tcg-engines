import type { CharacterCard } from "@tcg/op-types";
import { op10Franky034I18n } from "./034-franky.i18n.ts";

export const op10Franky034: CharacterCard = {
  id: "OP10-034",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew ODYSSEY"],
  attribute: "strike",
  effect:
    "[Once Per Turn] If this Character would be K.O.'d in battle, you may add 1 card from the top of your Life cards to your hand instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        replacementAction: {
          action: "removeFromLife",
          player: "self",
          count: {
            amount: 1,
          },
          destination: "hand",
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op10Franky034I18n,
};
