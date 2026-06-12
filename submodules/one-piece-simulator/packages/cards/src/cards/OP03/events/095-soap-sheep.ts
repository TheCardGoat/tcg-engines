import type { EventCard } from "@tcg/op-types";
import { op03SoapSheep095I18n } from "./095-soap-sheep.i18n.ts";

export const op03SoapSheep095: EventCard = {
  id: "OP03-095",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  traits: ["CP9"],
  effect:
    "[Main] Give up to 2 of your opponent's Characters -2 cost during this turn. [Trigger] Your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op03SoapSheep095I18n,
};
