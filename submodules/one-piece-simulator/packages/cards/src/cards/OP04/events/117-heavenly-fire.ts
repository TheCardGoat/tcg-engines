import type { EventCard } from "@tcg/op-types";
import { op04HeavenlyFire117I18n } from "./117-heavenly-fire.i18n.ts";

export const op04HeavenlyFire117: EventCard = {
  id: "OP04-117",
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP04",
  cost: 1,
  traits: ["The Four Emperors Big Mom Pirates"],
  effect:
    "[Main] Add up to 1 of your opponent's Characters with a cost of 3 or less to the top or bottom of your opponent's Life cards face-up. [Trigger] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 card from your hand to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "main",
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
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04HeavenlyFire117I18n,
};
