import type { CharacterCard } from "@tcg/op-types";
import { op06CharlottePudding047I18n } from "./047-charlotte-pudding.i18n.ts";

export const op06CharlottePudding047: CharacterCard = {
  id: "OP06-047",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  power: 4000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] Your opponent returns all cards in their hand to their deck and shuffles their deck. Then, your opponent draws 5 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: "all",
              },
            },
            position: "any",
          },
          {
            action: "draw",
            player: "opponent",
            amount: 5,
          },
        ],
      },
    ],
  },
  i18n: op06CharlottePudding047I18n,
};
