import type { LeaderCard } from "@tcg/op-types";
import { op05Enel098I18n } from "./098-enel.i18n.ts";

export const op05Enel098: LeaderCard = {
  id: "OP05-098",
  canonicalId: "OP05-098",
  slug: "enel/op05-098",
  name: "Enel",
  printings: [
    {
      id: "OP05-098",
      artId: "OP05-098",
      setCode: "OP05",
      collectorNumber: "098",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-098.jpg",
    },
    {
      id: "OP05-098_p1",
      artId: "OP05-098_p1",
      setCode: "OP05",
      collectorNumber: "098",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-098_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "OP05",
  power: 5000,
  life: 4,
  traits: ["Sky Island"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-098_p1.jpg",
      imageId: "OP05-098_p1",
    },
  ],
  effect:
    "[Opponent's Turn][Once Per Turn] When your number of Life cards becomes 0, add 1 card from the top of your deck to the top of your Life cards. Then, trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenLifeRemoved",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "eq",
            value: 0,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: { amount: 1 },
            },
            position: "top",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05Enel098I18n,
};
