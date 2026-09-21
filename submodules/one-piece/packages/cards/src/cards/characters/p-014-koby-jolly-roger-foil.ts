import type { CharacterCard } from "@tcg/op-types";
import { prb01KobyJollyRogerFoil014I18n } from "./p-014-koby-jolly-roger-foil.i18n.ts";

export const prb01KobyJollyRogerFoil014: CharacterCard = {
  id: "P-014",
  canonicalId: "P-014",
  slug: "koby-jolly-roger-foil",
  name: "Koby",
  printings: [
    {
      id: "P-014",
      artId: "P-014",
      setCode: "P",
      collectorNumber: "014",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-014_p2.jpg",
      label: "Koby (Jolly Roger Foil)",
    },
    {
      id: "P-014_r1",
      artId: "P-014_r1",
      setCode: "P",
      collectorNumber: "014",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-014_r1.jpg",
      label: "Koby (Reprint)",
    },
    {
      id: "P-014_p3",
      artId: "P-014_p3",
      setCode: "P",
      collectorNumber: "014",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-014_p3.jpg",
      label: "Koby (Full Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 3000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[Trigger] Play this card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: prb01KobyJollyRogerFoil014I18n,
};
