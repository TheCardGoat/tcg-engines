import type { EventCard } from "@tcg/op-types";
import { op14eb04Chambres017I18n } from "./017-chambres.i18n.ts";

export const op14eb04Chambres017: EventCard = {
  id: "OP14-017",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  traits: ["Heart Pirates Supernovas The Seven Warlords of the Sea"],
  effect:
    "[Main] Select 2 of your opponent's Characters with 9000 base power or less. Swap the base power of the selected Characters with each other during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "setPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 9000,
                },
              ],
            },
            value: 0,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Chambres017I18n,
};
