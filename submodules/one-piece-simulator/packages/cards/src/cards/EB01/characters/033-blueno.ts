import type { CharacterCard } from "@tcg/op-types";
import { eb01Blueno033I18n } from "./033-blueno.i18n.ts";

export const eb01Blueno033: CharacterCard = {
  id: "EB01-033",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "EB01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Water Seven"],
  attribute: "strike",
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [Water Seven] type, play up to 1 [Water Seven] type Character card with a cost of 5 other than [Blueno] from your hand or trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Water Seven",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Blueno",
              },
              {
                filter: "cost",
                comparison: "eq",
                value: 5,
              },
              {
                filter: "trait",
                value: "Water Seven",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb01Blueno033I18n,
};
