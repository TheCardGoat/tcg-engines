import type { StageCard } from "@tcg/op-types";
import { op07Egghead117I18n } from "./117-egghead.i18n.ts";

export const op07Egghead117: StageCard = {
  id: "OP07-117",
  cardType: "stage",
  color: ["yellow"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  traits: ["Egghead"],
  effect:
    "[End of Your Turn] If you have 3 or less Life cards, set up to 1 [Egghead] type Character with a cost of 5 or less as active. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Egghead",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op07Egghead117I18n,
};
