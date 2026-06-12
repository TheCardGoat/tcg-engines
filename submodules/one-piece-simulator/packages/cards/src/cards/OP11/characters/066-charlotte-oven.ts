import type { CharacterCard } from "@tcg/op-types";
import { op11CharlotteOven066I18n } from "./066-charlotte-oven.i18n.ts";

export const op11CharlotteOven066: CharacterCard = {
  id: "OP11-066",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Activate: Main] You may rest this Character: Choose a cost and reveal 1 card from the top of your opponent's deck. If the revealed card has the chosen cost, K.O. up to 1 of your opponent's Characters with a base cost of 3 or less. Then, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11CharlotteOven066I18n,
};
