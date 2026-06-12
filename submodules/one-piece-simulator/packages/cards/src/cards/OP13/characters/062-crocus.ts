import type { CharacterCard } from "@tcg/op-types";
import { op13Crocus062I18n } from "./062-crocus.i18n.ts";

export const op13Crocus062: CharacterCard = {
  id: "OP13-062",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Roger Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] If you have any DON!! cards given, add up to 1 DON!! card from your DON!! deck and set it as active.\n[When Attacking] Return up to 1 of your opponent's Characters with a base power of 3000 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donGiven",
            player: "self",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op13Crocus062I18n,
};
