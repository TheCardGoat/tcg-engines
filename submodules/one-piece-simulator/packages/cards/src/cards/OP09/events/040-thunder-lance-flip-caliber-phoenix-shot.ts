import type { EventCard } from "@tcg/op-types";
import { op09ThunderLanceFlipCaliberPhoenixShot040I18n } from "./040-thunder-lance-flip-caliber-phoenix-shot.i18n.ts";

export const op09ThunderLanceFlipCaliberPhoenixShot040: EventCard = {
  id: "OP09-040",
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Straw Hat Crew Supernovas ODYSSEY"],
  effect:
    "[Main] If you have 2 or more rested Characters, K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "state",
                value: "rested",
              },
            ],
          },
        ],
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op09ThunderLanceFlipCaliberPhoenixShot040I18n,
};
