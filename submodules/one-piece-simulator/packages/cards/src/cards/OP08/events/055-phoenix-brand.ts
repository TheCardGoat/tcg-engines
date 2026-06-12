import type { EventCard } from "@tcg/op-types";
import { op08PhoenixBrand055I18n } from "./055-phoenix-brand.i18n.ts";

export const op08PhoenixBrand055: EventCard = {
  id: "OP08-055",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP08",
  cost: 4,
  traits: ["Former Whitebeard Pirates"],
  effect:
    '[Main] You may reveal 2 cards with a type including "Whitebeard Piratess" from your hand: Place up to 1 Character with a cost of 6 or less at the bottom of the owner\'s deck.',
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
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
                  value: 6,
                },
              ],
            },
            position: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08PhoenixBrand055I18n,
};
