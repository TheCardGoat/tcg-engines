import type { CharacterCard } from "@tcg/op-types";
import { eb02MadTreasure057I18n } from "./057-mad-treasure.i18n.ts";

export const eb02MadTreasure057: CharacterCard = {
  id: "EB02-057",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Treasure Pirates"],
  attribute: "special",
  effect:
    "[When Attacking] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 of your opponent's Characters with a cost of 3 or less to the top or bottom of your opponent's Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "addToLife",
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
                  value: 3,
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02MadTreasure057I18n,
};
