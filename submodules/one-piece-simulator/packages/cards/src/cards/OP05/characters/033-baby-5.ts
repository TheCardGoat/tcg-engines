import type { CharacterCard } from "@tcg/op-types";
import { op05Baby5033I18n } from "./033-baby-5.i18n.ts";

export const op05Baby5033: CharacterCard = {
  id: "OP05-033",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP05",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character: Play up to 1 [Donquixote Pirates] type Character card with a cost of 2 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
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
                filter: "cost",
                comparison: "lte",
                value: 2,
              },
              {
                filter: "trait",
                value: "Donquixote Pirates",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05Baby5033I18n,
};
