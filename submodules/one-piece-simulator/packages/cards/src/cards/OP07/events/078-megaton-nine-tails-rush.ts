import type { EventCard } from "@tcg/op-types";
import { op07MegatonNineTailsRush078I18n } from "./078-megaton-nine-tails-rush.i18n.ts";

export const op07MegatonNineTailsRush078: EventCard = {
  id: "OP07-078",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP07",
  cost: 3,
  traits: ["Foxy Pirates"],
  effect:
    "[Main] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, set up to 1 of your [Foxy] cards as active. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Foxy",
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
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: op07MegatonNineTailsRush078I18n,
};
