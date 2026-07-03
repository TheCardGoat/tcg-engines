import type { CharacterCard } from "@tcg/op-types";
import { prb01CharlotteBruleeJollyRogerFoil007I18n } from "./007-charlotte-brulee-jolly-roger-foil.i18n.ts";

export const prb01CharlotteBruleeJollyRogerFoil007: CharacterCard = {
  id: "ST07-007",
  canonicalId: "ST07-007",
  slug: "charlotte-brulee-jolly-roger-foil",
  name: "Charlotte Brulee (Jolly Roger Foil)",
  printings: [
    {
      id: "ST07-007",
      artId: "ST07-007",
      setCode: "PRB01",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST07-007_p2.jpg",
    },
    {
      id: "ST07-007_p3",
      artId: "ST07-007_p3",
      setCode: "PRB01",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST07-007_p3.jpg",
    },
    {
      id: "ST07-007_r1",
      artId: "ST07-007_r1",
      setCode: "PRB01",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST07-007_r1.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "PRB01",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST07-007_p3.jpg",
      imageId: "ST07-007_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST07-007_r1.png",
      imageId: "ST07-007_r1",
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
  i18n: prb01CharlotteBruleeJollyRogerFoil007I18n,
};
