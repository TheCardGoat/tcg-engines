import type { CharacterCard } from "@tcg/op-types";
import { eb03CharlottePudding035I18n } from "./035-charlotte-pudding.i18n.ts";

export const eb03CharlottePudding035: CharacterCard = {
  id: "EB03-035",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "EB03",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    "[Blocker]\n[On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: eb03CharlottePudding035I18n,
};
