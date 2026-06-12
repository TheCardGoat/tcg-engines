import type { CharacterCard } from "@tcg/op-types";
import { eb01ScratchmenApoo015I18n } from "./015-scratchmen-apoo.i18n.ts";

export const eb01ScratchmenApoo015: CharacterCard = {
  id: "EB01-015",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "EB01",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["On-Air Pirates Supernovas"],
  attribute: "special",
  effect: "[On Play] Rest up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
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
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb01ScratchmenApoo015I18n,
};
