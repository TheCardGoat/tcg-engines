import type { EventCard } from "@tcg/op-types";
import { op05PunkRotten078I18n } from "./078-punk-rotten.i18n.ts";

export const op05PunkRotten078: EventCard = {
  id: "OP05-078",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP05",
  cost: 2,
  traits: ["Kid Pirates"],
  effect:
    "[Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Up to 1 of your [Kid Pirates] type Leader or Character cards gains +5000 power during this turn. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
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
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Kid Pirates",
                },
              ],
            },
            value: 5000,
            duration: "thisTurn",
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
  i18n: op05PunkRotten078I18n,
};
