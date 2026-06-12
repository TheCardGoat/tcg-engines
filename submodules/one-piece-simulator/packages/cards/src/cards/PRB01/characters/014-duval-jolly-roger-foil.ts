import type { CharacterCard } from "@tcg/op-types";
import { prb01DuvalJollyRogerFoil014I18n } from "./014-duval-jolly-roger-foil.i18n.ts";

export const prb01DuvalJollyRogerFoil014: CharacterCard = {
  id: "ST12-014",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "PRB01",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["The Flying Fish Riders"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-014_p3.jpg",
      imageId: "ST12-014_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-014_r1.png",
      imageId: "ST12-014_r1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] Look at 3 cards from the top of your deck and place them at the top or bottom of the deck in any order.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 3,
            position: "topOrBottom",
          },
        ],
      },
    ],
  },
  i18n: prb01DuvalJollyRogerFoil014I18n,
};
