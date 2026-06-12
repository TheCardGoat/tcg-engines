import type { EventCard } from "@tcg/op-types";
import { op07Shave094I18n } from "./094-shave.i18n.ts";

export const op07Shave094: EventCard = {
  id: "OP07-094",
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  traits: ["CP9"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if you have 10 or more cards in your trash, return up to 1 of your Characters with a type including \"CP\" to the owner's hand. [Trigger] Return up to 1 of your Characters to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op07Shave094I18n,
};
