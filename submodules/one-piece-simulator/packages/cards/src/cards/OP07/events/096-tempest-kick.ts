import type { EventCard } from "@tcg/op-types";
import { op07TempestKick096I18n } from "./096-tempest-kick.i18n.ts";

export const op07TempestKick096: EventCard = {
  id: "OP07-096",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP07",
  cost: 1,
  traits: ["CP9"],
  effect:
    "[Main] Draw 1 card. Then, if you have 10 or more cards in your trash, give up to 1 of your opponent's Characters -3 cost during this turn. [Trigger] K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07TempestKick096I18n,
};
