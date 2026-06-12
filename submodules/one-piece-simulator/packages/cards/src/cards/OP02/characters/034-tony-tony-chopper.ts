import type { CharacterCard } from "@tcg/op-types";
import { op02TonyTonyChopper034I18n } from "./034-tony-tony-chopper.i18n.ts";

export const op02TonyTonyChopper034: CharacterCard = {
  id: "OP02-034",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP02",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Animal Film Straw Hat Crew"],
  attribute: "wisdom",
  effect:
    "[DON!! x1] [When Attacking] Rest up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
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
  i18n: op02TonyTonyChopper034I18n,
};
