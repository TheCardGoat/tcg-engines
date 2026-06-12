import type { EventCard } from "@tcg/op-types";
import { op04TruenoBastardo094I18n } from "./094-trueno-bastardo.i18n.ts";

export const op04TruenoBastardo094: EventCard = {
  id: "OP04-094",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP04",
  cost: 4,
  traits: ["Dressrosa"],
  effect:
    "[Main] Choose up to 1 of your opponent's Characters with a cost of 4 or less and K.O. it. If you have 15 or more cards in your trash, choose up to 1 of your opponent's Characters with a cost of 6 or less instead of a Character with a cost of 4 or less. [Trigger] You may rest your Leader: K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
              },
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "ko",
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
        optional: true,
      },
    ],
  },
  i18n: op04TruenoBastardo094I18n,
};
