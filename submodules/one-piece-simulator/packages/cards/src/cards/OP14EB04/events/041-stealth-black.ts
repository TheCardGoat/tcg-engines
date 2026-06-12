import type { EventCard } from "@tcg/op-types";
import { op14eb04StealthBlack041I18n } from "./041-stealth-black.i18n.ts";

export const op14eb04StealthBlack041: EventCard = {
  id: "EB04-041",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  trigger: "Draw 2 cards and trash 1 card from your hand.",
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] If your Leader is [Sanji] and you have 4 or more DON!! cards on your field, play up to 1 [Sanji] with 6000 power or less from your hand or trash.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderName",
                name: "Sanji",
              },
              {
                condition: "donFieldCount",
                player: "self",
                comparison: "gte",
                value: 4,
              },
            ],
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
              },
              {
                filter: "name",
                value: "Sanji",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op14eb04StealthBlack041I18n,
};
