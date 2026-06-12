import type { StageCard } from "@tcg/op-types";
import { prb01KingdomOfGermaJollyRogerFoil079I18n } from "./079-kingdom-of-germa-jolly-roger-foil.i18n.ts";

export const prb01KingdomOfGermaJollyRogerFoil079: StageCard = {
  id: "OP06-079",
  cardType: "stage",
  color: ["purple"],
  rarity: "C",
  setId: "PRB01",
  cost: 1,
  traits: ["Kingdom of GERMA"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_p3.jpg",
      imageId: "OP06-079_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_r1.png",
      imageId: "OP06-079_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-079_p4.jpg",
      imageId: "OP06-079_p4",
    },
  ],
  effect:
    '[Activate:Main] You may trash 1 card from your hand and rest this Stage: Look at 3 cards from the top of your deck; reveal up to 1 card with a type including "GERMA" and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01KingdomOfGermaJollyRogerFoil079I18n,
};
