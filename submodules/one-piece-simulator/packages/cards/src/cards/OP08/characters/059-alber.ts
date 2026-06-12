import type { CharacterCard } from "@tcg/op-types";
import { op08Alber059I18n } from "./059-alber.i18n.ts";

export const op08Alber059: CharacterCard = {
  id: "OP08-059",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates Lunarian"],
  attribute: "special",
  effect:
    "[Activate:Main] You may trash this Character: If your Leader has the [Animal Kingdom Pirates] type and you have 10 DON!! cards on your field, play up to 1 [King] with a cost of 7 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Animal Kingdom Pirates",
              },
              {
                condition: "donFieldCount",
                player: "self",
                comparison: "eq",
                value: 10,
              },
            ],
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
                filter: "cost",
                comparison: "lte",
                value: 7,
              },
              {
                filter: "name",
                value: "King",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08Alber059I18n,
};
