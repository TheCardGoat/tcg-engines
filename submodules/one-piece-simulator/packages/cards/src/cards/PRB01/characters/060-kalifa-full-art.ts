import type { CharacterCard } from "@tcg/op-types";
import { prb01KalifaFullArt060I18n } from "./060-kalifa-full-art.i18n.ts";

export const prb01KalifaFullArt060: CharacterCard = {
  id: "OP03-060",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "PRB01",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Galley-La Company Water Seven"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-060_r1.jpg",
      imageId: "OP03-060_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-060_p2.jpg",
      imageId: "OP03-060_p2",
    },
  ],
  effect:
    "[When Attacking] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
  i18n: prb01KalifaFullArt060I18n,
};
