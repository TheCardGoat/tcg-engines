import type { EventCard } from "@tcg/op-types";
import { op09NeverUnderestimateThePowerOfMiracles116I18n } from "./116-never-underestimate-the-power-of-miracles.i18n.ts";

export const op09NeverUnderestimateThePowerOfMiracles116: EventCard = {
  id: "OP09-116",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP09",
  cost: 1,
  trigger:
    'Play up to 1 "Revolutionary Army" type Character card with a cost of 4 or less from your hand.',
  traits: ["Revolutionary Army"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op09NeverUnderestimateThePowerOfMiracles116I18n,
};
