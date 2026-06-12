import type { LeaderCard } from "@tcg/op-types";
import { op05Sakazuki041I18n } from "./041-sakazuki.i18n.ts";

export const op05Sakazuki041: LeaderCard = {
  id: "OP05-041",
  cardType: "leader",
  color: ["blue", "black"],
  rarity: "L",
  setId: "OP05",
  power: 5000,
  life: 4,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-041_p1.jpg",
      imageId: "OP05-041_p1",
    },
  ],
  effect:
    "[Activate:Main][Once Per Turn] You may trash 1 card from your hand: Draw 1 card. [When Attacking] Give up to 1 of your opponent's Characters -1 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
      {
        trigger: "whenAttacking",
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
            value: -1,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op05Sakazuki041I18n,
};
