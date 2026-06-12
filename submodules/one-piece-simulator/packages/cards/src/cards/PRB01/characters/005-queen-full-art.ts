import type { CharacterCard } from "@tcg/op-types";
import { prb01QueenFullArt005I18n } from "./005-queen-full-art.i18n.ts";

export const prb01QueenFullArt005: CharacterCard = {
  id: "ST04-005",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "PRB01",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_p3.jpg",
      imageId: "ST04-005_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST04-005_r1.png",
      imageId: "ST04-005_r1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Draw 2 cards and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
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
  i18n: prb01QueenFullArt005I18n,
};
