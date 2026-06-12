import type { EventCard } from "@tcg/op-types";
import { op01OfficerAgents087I18n } from "./087-officer-agents.i18n.ts";

export const op01OfficerAgents087: EventCard = {
  id: "OP01-087",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  traits: ["Baroque Works"],
  effect:
    '[Counter] Play up to 1 "Baroque Works" type card with a cost of 3 or less from your hand.  This card has been officially errata\'d.',
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
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
              {
                filter: "trait",
                value: "Baroque Works",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op01OfficerAgents087I18n,
};
