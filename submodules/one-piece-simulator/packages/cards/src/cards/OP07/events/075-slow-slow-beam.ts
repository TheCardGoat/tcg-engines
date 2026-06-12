import type { EventCard } from "@tcg/op-types";
import { op07SlowSlowBeam075I18n } from "./075-slow-slow-beam.i18n.ts";

export const op07SlowSlowBeam075: EventCard = {
  id: "OP07-075",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  traits: ["Foxy Pirates"],
  effect:
    "[Counter] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Give up to 1 each of your opponent's Leader and Character cards -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op07SlowSlowBeam075I18n,
};
