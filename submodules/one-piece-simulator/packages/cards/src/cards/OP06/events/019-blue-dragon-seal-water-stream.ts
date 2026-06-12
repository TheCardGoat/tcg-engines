import type { EventCard } from "@tcg/op-types";
import { op06BlueDragonSealWaterStream019I18n } from "./019-blue-dragon-seal-water-stream.i18n.ts";

export const op06BlueDragonSealWaterStream019: EventCard = {
  id: "OP06-019",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP06",
  cost: 3,
  trigger: "K.O. up to 1 of your opponent's Characters with 4000 power or less.",
  traits: ["FILM Straw Hat Crew"],
  effect: "[Main] K.O. up to 1 of your opponent's Characters with 5000 power or less.",
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
                  filter: "power",
                  comparison: "lte",
                  value: 5000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op06BlueDragonSealWaterStream019I18n,
};
