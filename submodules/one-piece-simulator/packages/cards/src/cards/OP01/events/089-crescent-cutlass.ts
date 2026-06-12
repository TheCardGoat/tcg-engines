import type { EventCard } from "@tcg/op-types";
import { op01CrescentCutlass089I18n } from "./089-crescent-cutlass.i18n.ts";

export const op01CrescentCutlass089: EventCard = {
  id: "OP01-089",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  effect:
    "[Counter] If your Leader has the \"The Seven Warlords of the Sea\" type, return up to 1 Character with a cost of 5 or less to the owner's hand.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "The Seven Warlords of the Sea",
          },
        ],
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01CrescentCutlass089I18n,
};
