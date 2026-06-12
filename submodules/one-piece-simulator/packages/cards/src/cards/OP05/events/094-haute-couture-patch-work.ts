import type { EventCard } from "@tcg/op-types";
import { op05HauteCouturePatchWork094I18n } from "./094-haute-couture-patch-work.i18n.ts";

export const op05HauteCouturePatchWork094: EventCard = {
  id: "OP05-094",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP05",
  cost: 1,
  traits: ["Dressrosa The Tontattas"],
  effect:
    "[Main] Give up to 1 of your opponent's Characters -3 cost during this turn. Then, up to 1 of your opponent's Characters with a cost of 0 will not become active in the next Refresh Phase. [Trigger] Draw 2 cards and trash 1 card from your hand.",
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
                amount: 1,
                upTo: true,
              },
            },
            value: -3,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op05HauteCouturePatchWork094I18n,
};
