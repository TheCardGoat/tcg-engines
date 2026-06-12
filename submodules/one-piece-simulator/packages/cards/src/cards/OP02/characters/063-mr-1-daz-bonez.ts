import type { CharacterCard } from "@tcg/op-types";
import { op02Mr1DazBonez063I18n } from "./063-mr-1-daz-bonez.i18n.ts";

export const op02Mr1DazBonez063: CharacterCard = {
  id: "OP02-063",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP02",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Impel Down Former Baroque Works"],
  attribute: "slash",
  effect: "[On Play] Add up to 1 blue Event card with a cost of 1 from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "blue",
                },
                {
                  filter: "cardCategory",
                  value: "event",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op02Mr1DazBonez063I18n,
};
