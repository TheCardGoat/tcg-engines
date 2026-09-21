import type { CharacterCard } from "@tcg/op-types";
import { prb01DuvalJollyRogerFoil014I18n } from "./st12-014-duval-jolly-roger-foil.i18n.ts";

export const prb01DuvalJollyRogerFoil014: CharacterCard = {
  id: "ST12-014",
  canonicalId: "ST12-014",
  slug: "duval-jolly-roger-foil",
  name: "Duval",
  printings: [
    {
      id: "ST12-014",
      artId: "ST12-014",
      setCode: "ST12",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-014_p2.jpg",
      label: "Duval (Jolly Roger Foil)",
    },
    {
      id: "ST12-014_p3",
      artId: "ST12-014_p3",
      setCode: "ST12",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-014_p3.jpg",
      label: "Duval (Full Art)",
    },
    {
      id: "ST12-014_r1",
      artId: "ST12-014_r1",
      setCode: "ST12",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST12-014_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST12",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["The Flying Fish Riders"],
  attribute: "strike",
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
