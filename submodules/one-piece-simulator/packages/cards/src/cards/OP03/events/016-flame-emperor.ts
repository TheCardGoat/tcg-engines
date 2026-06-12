import type { EventCard } from "@tcg/op-types";
import { op03FlameEmperor016I18n } from "./016-flame-emperor.i18n.ts";

export const op03FlameEmperor016: EventCard = {
  id: "OP03-016",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP03",
  cost: 7,
  traits: ["Whitebeard Pirates"],
  effect:
    "[Main] If your Leader is [Portgas.D.Ace], K.O. up to 1 of your opponent's Characters with 8000 power or less, and your Leader gains [Double Attack] and +3000 power during this turn. (This card deals 2 damage.) [Trigger] K.O. up to 1 of your opponent's Characters with 6000 power or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Portgas.D.Ace",
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
                  filter: "power",
                  comparison: "lte",
                  value: 8000,
                },
              ],
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
                  filter: "power",
                  comparison: "lte",
                  value: 6000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03FlameEmperor016I18n,
};
