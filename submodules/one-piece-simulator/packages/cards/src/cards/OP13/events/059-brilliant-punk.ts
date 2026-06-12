import type { EventCard } from "@tcg/op-types";
import { op13BrilliantPunk059I18n } from "./059-brilliant-punk.i18n.ts";

export const op13BrilliantPunk059: EventCard = {
  id: "OP13-059",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP13",
  cost: 4,
  traits: ["Whitebeard Pirates"],
  effect:
    "[Main] You may return 1 of your Characters to the owner's hand: Return up to 1 Character with a cost of 6 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToHand",
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
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13BrilliantPunk059I18n,
};
