import type { EventCard } from "@tcg/op-types";
import { op03FieryDoll019I18n } from "./019-fiery-doll.i18n.ts";

export const op03FieryDoll019: EventCard = {
  id: "OP03-019",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  traits: ["Whitebeard Pirates"],
  effect:
    "[Main] Your Leader gains +4000 power during this turn. [Trigger] Give up to 1 of your opponent's Leader or Character cards -10000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 4000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -10000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op03FieryDoll019I18n,
};
