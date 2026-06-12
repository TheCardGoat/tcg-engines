import type { EventCard } from "@tcg/op-types";
import { op12BrochetteBlow078I18n } from "./078-brochette-blow.i18n.ts";

export const op12BrochetteBlow078: EventCard = {
  id: "OP12-078",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP12",
  cost: 3,
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, draw 1 card. Then, give up to 1 of your opponent's Characters 3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op12BrochetteBlow078I18n,
};
