import type { CharacterCard } from "@tcg/op-types";
import { prb01TonyTonyChopperSt01006JollyRogerFoil006I18n } from "./006-tony-tony-chopper-st01-006-jolly-roger-foil.i18n.ts";

export const prb01TonyTonyChopperSt01006JollyRogerFoil006: CharacterCard = {
  id: "ST01-006",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "PRB01",
  cost: 1,
  power: 1000,
  traits: ["Animal Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-006_p7.jpg",
      imageId: "ST01-006_p7",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-006_r1.png",
      imageId: "ST01-006_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-006_p8.jpg",
      imageId: "ST01-006_p8",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb01TonyTonyChopperSt01006JollyRogerFoil006I18n,
};
