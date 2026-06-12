import type { CharacterCard } from "@tcg/op-types";
import { prb01ShirahoshiOp05082JollyRogerFoil082I18n } from "./082-shirahoshi-op05-082-jolly-roger-foil.i18n.ts";

export const prb01ShirahoshiOp05082JollyRogerFoil082: CharacterCard = {
  id: "OP05-082",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "PRB01",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-082_r1.jpg",
      imageId: "OP05-082_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-082_p3.jpg",
      imageId: "OP05-082_p3",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-082_p4.jpg",
      imageId: "OP05-082_p4",
    },
  ],
  effect:
    "[Activate:Main] You may rest this Character and place 2 cards from your trash at the bottom of your deck in any order: If your opponent has 6 or more cards in their hand, your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 6,
          },
        ],
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01ShirahoshiOp05082JollyRogerFoil082I18n,
};
