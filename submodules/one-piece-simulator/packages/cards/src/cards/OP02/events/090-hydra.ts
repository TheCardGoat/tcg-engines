import type { EventCard } from "@tcg/op-types";
import { op02Hydra090I18n } from "./090-hydra.i18n.ts";

export const op02Hydra090: EventCard = {
  id: "OP02-090",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP02",
  cost: 1,
  traits: ["Impel Down"],
  effect:
    "[Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Give up to 1 of your opponent's Characters -3000 power during this turn. [Trigger] If your opponent has 6 or more DON!! cards on their field, your opponent returns 1 DON!! card from their field to their DON!! deck.",
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
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
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
  i18n: op02Hydra090I18n,
};
