import type { EventCard } from "@tcg/op-types";
import { op04NezPalmCannon075I18n } from "./075-nez-palm-cannon.i18n.ts";

export const op04NezPalmCannon075: EventCard = {
  id: "OP04-075",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP04",
  cost: 3,
  traits: ["Baroque Works"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +6000 power during this battle. Then, if you have 2 or less Life cards, add up to 1 DON!! card from your DON!! deck and rest it. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
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
            value: 6000,
            duration: "thisBattle",
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
  i18n: op04NezPalmCannon075I18n,
};
