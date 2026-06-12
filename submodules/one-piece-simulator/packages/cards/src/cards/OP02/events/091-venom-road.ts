import type { EventCard } from "@tcg/op-types";
import { op02VenomRoad091I18n } from "./091-venom-road.i18n.ts";

export const op02VenomRoad091: EventCard = {
  id: "OP02-091",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP02",
  cost: 3,
  traits: ["Impel Down"],
  effect:
    "[Main] Add up to 1 DON!! card from your DON!! deck and set it as active. [Trigger] If your opponent has 6 or more DON!! cards on their field, your opponent returns 1 DON!! card from their field to their DON!! deck.",
  effects: {
    effects: [
      {
        trigger: "main",
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
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "donFieldCount",
            player: "opponent",
            comparison: "gte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "opponentReturnDon",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op02VenomRoad091I18n,
};
