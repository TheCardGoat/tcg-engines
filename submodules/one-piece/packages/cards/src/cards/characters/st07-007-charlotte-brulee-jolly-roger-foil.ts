import type { CharacterCard } from "@tcg/op-types";
import { prb01CharlotteBruleeJollyRogerFoil007I18n } from "./st07-007-charlotte-brulee-jolly-roger-foil.i18n.ts";

export const prb01CharlotteBruleeJollyRogerFoil007: CharacterCard = {
  id: "ST07-007",
  canonicalId: "ST07-007",
  slug: "charlotte-brulee-jolly-roger-foil",
  name: "Charlotte Brulee",
  printings: [
    {
      id: "ST07-007",
      artId: "ST07-007",
      setCode: "ST07",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST07-007_p2.jpg",
      label: "Charlotte Brulee (Jolly Roger Foil)",
    },
    {
      id: "ST07-007_p3",
      artId: "ST07-007_p3",
      setCode: "ST07",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST07-007_p3.jpg",
      label: "Charlotte Brulee (Full Art)",
    },
    {
      id: "ST07-007_r1",
      artId: "ST07-007_r1",
      setCode: "ST07",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST07-007_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST07",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
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
  i18n: prb01CharlotteBruleeJollyRogerFoil007I18n,
};
