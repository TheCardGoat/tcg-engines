import type { EventCard } from "@tcg/op-types";
import { op03TopKnot074I18n } from "./074-top-knot.i18n.ts";

export const op03TopKnot074: EventCard = {
  id: "OP03-074",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP03",
  cost: 2,
  traits: ["Galley-La Company Water Seven"],
  effect:
    "[Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Place up to 1 of your opponent's Characters with a cost of 4 or less at the bottom of the owner's deck. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
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
                  value: 4,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op03TopKnot074I18n,
};
