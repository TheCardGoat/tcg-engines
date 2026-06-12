import type { CharacterCard } from "@tcg/op-types";
import { op13Otama043I18n } from "./043-otama.i18n.ts";

export const op13Otama043: CharacterCard = {
  id: "OP13-043",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP13",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Land of Wano"],
  attribute: "special",
  effect:
    "[On Play] If you have 3 or less Life cards, draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op13Otama043I18n,
};
