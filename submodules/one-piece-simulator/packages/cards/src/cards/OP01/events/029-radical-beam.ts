import type { EventCard } from "@tcg/op-types";
import { op01RadicalBeam029I18n } from "./029-radical-beam.i18n.ts";

export const op01RadicalBeam029: EventCard = {
  id: "OP01-029",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP01",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 2 or less Life cards, that card gains an additional +2000 power.  This card has been officially errata'd.",
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
  i18n: op01RadicalBeam029I18n,
};
