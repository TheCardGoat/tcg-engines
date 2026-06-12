import type { CharacterCard } from "@tcg/op-types";
import { prb01CaponeGangBegeSt02004JollyRogerFoil004I18n } from "./004-capone-gang-bege-st02-004-jolly-roger-foil.i18n.ts";

export const prb01CaponeGangBegeSt02004JollyRogerFoil004: CharacterCard = {
  id: "ST02-004",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "PRB01",
  cost: 1,
  power: 1000,
  traits: ["Firetank Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-004_p4.jpg",
      imageId: "ST02-004_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-004_r1.png",
      imageId: "ST02-004_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-004_p4_M22zdUX.jpg",
      imageId: "ST02-004_p4",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb01CaponeGangBegeSt02004JollyRogerFoil004I18n,
};
