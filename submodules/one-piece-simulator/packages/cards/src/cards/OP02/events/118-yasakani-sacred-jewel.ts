import type { EventCard } from "@tcg/op-types";
import { op02YasakaniSacredJewel118I18n } from "./118-yasakani-sacred-jewel.i18n.ts";

export const op02YasakaniSacredJewel118: EventCard = {
  id: "OP02-118",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  traits: ["Navy"],
  effect:
    "[Counter] You may trash 1 card from your hand: Select up to 1 of your Characters. The selected Character cannot be K.O.'d during this battle. [Trigger] K.O. up to 1 of your opponent's Stages with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["stage"],
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
  i18n: op02YasakaniSacredJewel118I18n,
};
