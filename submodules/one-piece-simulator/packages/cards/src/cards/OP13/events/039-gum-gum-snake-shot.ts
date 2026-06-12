import type { EventCard } from "@tcg/op-types";
import { op13GumGumSnakeShot039I18n } from "./039-gum-gum-snake-shot.i18n.ts";

export const op13GumGumSnakeShot039: EventCard = {
  id: "OP13-039",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP13",
  cost: 2,
  trigger: "Activate this card's [Counter] effect.",
  traits: ["Straw Hat Crew Supernovas Fish-Man Island"],
  effect: "[Counter] K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op13GumGumSnakeShot039I18n,
};
