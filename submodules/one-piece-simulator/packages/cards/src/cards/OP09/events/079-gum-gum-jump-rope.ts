import type { EventCard } from "@tcg/op-types";
import { op09GumGumJumpRope079I18n } from "./079-gum-gum-jump-rope.i18n.ts";

export const op09GumGumJumpRope079: EventCard = {
  id: "OP09-079",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  trigger: "Add up to 1 DON!! card from your DON!! deck and set it as active.",
  traits: ["Straw Hat Crew The Four Emperors"],
  effect:
    "[Main] DON!! 2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 1 of your opponent's Characters with a cost of 5 or less. Then, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "rest",
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
                  value: 5,
                },
              ],
            },
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op09GumGumJumpRope079I18n,
};
