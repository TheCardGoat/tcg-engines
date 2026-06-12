import type { EventCard } from "@tcg/op-types";
import { op14eb04Salamander116I18n } from "./116-salamander.i18n.ts";

export const op14eb04Salamander116: EventCard = {
  id: "OP14-116",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 4,
  trigger: "Draw 1 card.",
  traits: ["Kuja Pirates"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, play up to 1 {Amazon Lily} or {Kuja Pirates} type Character card with a cost of 4 or less from your hand.",
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
            value: 2000,
            duration: "thisBattle",
          },
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
                value: 4,
              },
              {
                filter: "trait",
                value: "Amazon Lily",
              },
              {
                filter: "trait",
                value: "Kuja Pirates",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op14eb04Salamander116I18n,
};
