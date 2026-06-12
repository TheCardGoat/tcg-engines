import type { CharacterCard } from "@tcg/op-types";
import { prb01ShirahoshiOp03116JollyRogerFoil116I18n } from "./116-shirahoshi-op03-116-jolly-roger-foil.i18n.ts";

export const prb01ShirahoshiOp03116JollyRogerFoil116: CharacterCard = {
  id: "OP03-116",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "PRB01",
  cost: 5,
  power: 0,
  counter: 1000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-116_p6.jpg",
      imageId: "OP03-116_p6",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-116_r1.jpg",
      imageId: "OP03-116_r1",
    },
  ],
  effect: "[On Play] Draw 3 cards and trash 2 cards from your hand.[Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: prb01ShirahoshiOp03116JollyRogerFoil116I18n,
};
