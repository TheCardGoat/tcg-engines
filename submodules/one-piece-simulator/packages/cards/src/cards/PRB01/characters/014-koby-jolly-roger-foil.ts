import type { CharacterCard } from "@tcg/op-types";
import { prb01KobyJollyRogerFoil014I18n } from "./014-koby-jolly-roger-foil.i18n.ts";

export const prb01KobyJollyRogerFoil014: CharacterCard = {
  id: "P-014",
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "PRB01",
  cost: 3,
  power: 3000,
  traits: ["Navy"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-014_r1.jpg",
      imageId: "P-014_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-014_p3.jpg",
      imageId: "P-014_p3",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[Trigger] Play this card.",
  effects: {
    keywords: ["blocker"],
    effects: [
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
  i18n: prb01KobyJollyRogerFoil014I18n,
};
