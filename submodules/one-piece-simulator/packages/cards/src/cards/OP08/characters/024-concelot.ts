import type { CharacterCard } from "@tcg/op-types";
import { op08Concelot024I18n } from "./024-concelot.i18n.ts";

export const op08Concelot024: CharacterCard = {
  id: "OP08-024",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP08",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "slash",
  effect:
    "[When Attacking] Up to 1 of your opponent's rested Characters with a cost of 4 or less will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08Concelot024I18n,
};
