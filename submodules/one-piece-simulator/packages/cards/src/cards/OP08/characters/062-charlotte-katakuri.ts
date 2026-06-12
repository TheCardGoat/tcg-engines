import type { CharacterCard } from "@tcg/op-types";
import { op08CharlotteKatakuri062I18n } from "./062-charlotte-katakuri.i18n.ts";

export const op08CharlotteKatakuri062: CharacterCard = {
  id: "OP08-062",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP08",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  effect:
    "[Activate:Main] You may trash this Character: If your Leader has the {Big Mom Pirates} type, play up to 1 [Charlotte Katakuri] from your hand with a cost of 3 or more that is equal to or less than the number of DON!! cards on your opponent's field.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Big Mom Pirates",
          },
        ],
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Charlotte Katakuri",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08CharlotteKatakuri062I18n,
};
