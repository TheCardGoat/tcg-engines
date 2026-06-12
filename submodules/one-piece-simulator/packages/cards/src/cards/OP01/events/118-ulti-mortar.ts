import type { EventCard } from "@tcg/op-types";
import { op01UltiMortar118I18n } from "./118-ulti-mortar.i18n.ts";

export const op01UltiMortar118: EventCard = {
  id: "OP01-118",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP01",
  cost: 1,
  traits: ["Animal Kingdom Pirates"],
  effect:
    "[Counter] DON!! -2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, draw 1 card. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
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
            },
            value: 2000,
            duration: "thisBattle",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
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
  i18n: op01UltiMortar118I18n,
};
