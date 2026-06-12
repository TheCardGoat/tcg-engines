import type { EventCard } from "@tcg/op-types";
import { op10DamnedPunk116I18n } from "./116-damned-punk.i18n.ts";

export const op10DamnedPunk116: EventCard = {
  id: "OP10-116",
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP10",
  cost: 4,
  trigger: "Draw 2 cards and trash 1 card from your hand.",
  traits: ["Kid Pirates Supernovas"],
  effect:
    "[Main] Look at up to 1 card from the top of your or your opponent's Life cards and place it at the top or bottom of the Life cards. Then, K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
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
      },
    ],
  },
  i18n: op10DamnedPunk116I18n,
};
