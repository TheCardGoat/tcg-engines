import type { CharacterCard } from "@tcg/op-types";
import { eb03JewelryBonney017I18n } from "./017-jewelry-bonney.i18n.ts";

export const eb03JewelryBonney017: CharacterCard = {
  id: "EB03-017",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "EB03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  effect:
    "[On Play] If your Leader has the {Supernovas} type, set up to 1 of your DON!! cards as active. Then, up to 1 of your opponent's Characters with a cost of 8 or less cannot be rested until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Supernovas",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
          {
            action: "cannotBeRested",
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
                  value: 8,
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: eb03JewelryBonney017I18n,
};
