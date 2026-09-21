import type { CharacterCard } from "@tcg/op-types";
import { prb01CaponeGangBegeSt02004JollyRogerFoil004I18n } from "./st02-004-capone-gang-bege-st02-004-jolly-roger-foil.i18n.ts";

export const prb01CaponeGangBegeSt02004JollyRogerFoil004: CharacterCard = {
  id: "ST02-004",
  canonicalId: "ST02-004",
  slug: "capone-gang-bege-st02-004-jolly-roger-foil",
  name: 'Capone"Gang"Bege',
  printings: [
    {
      id: "ST02-004",
      artId: "ST02-004",
      setCode: "ST02",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-004_p2.jpg",
      label: 'Capone"Gang"Bege (ST02-004) (Jolly Roger Foil)',
    },
    {
      id: "ST02-004_p4",
      artId: "ST02-004_p4",
      setCode: "ST02",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-004_p4.jpg",
    },
    {
      id: "ST02-004_r1",
      artId: "ST02-004_r1",
      setCode: "ST02",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-004_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST02",
  cost: 1,
  power: 1000,
  traits: ["Firetank Pirates Supernovas"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb01CaponeGangBegeSt02004JollyRogerFoil004I18n,
};
