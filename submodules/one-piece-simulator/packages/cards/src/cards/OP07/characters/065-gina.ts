import type { CharacterCard } from "@tcg/op-types";
import { op07Gina065I18n } from "./065-gina.i18n.ts";

export const op07Gina065: CharacterCard = {
  id: "OP07-065",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Foxy Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] If your Leader has the [Foxy Pirates] type and the number of DON!! cards on your field is equal to or less than the number on your opponent's field, add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Foxy Pirates",
              },
              {
                condition: "donFieldComparison",
                selfComparison: "lte",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: op07Gina065I18n,
};
