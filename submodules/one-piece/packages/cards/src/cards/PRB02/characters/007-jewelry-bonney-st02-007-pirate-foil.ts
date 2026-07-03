import type { CharacterCard } from "@tcg/op-types";
import { prb02JewelryBonneySt02007PirateFoil007I18n } from "./007-jewelry-bonney-st02-007-pirate-foil.i18n.ts";

export const prb02JewelryBonneySt02007PirateFoil007: CharacterCard = {
  id: "ST02-007",
  canonicalId: "ST02-007",
  slug: "jewelry-bonney-st02-007-pirate-foil",
  name: "Jewelry Bonney - ST02-007 (Pirate Foil)",
  printings: [
    {
      id: "ST02-007",
      artId: "ST02-007",
      setCode: "PRB02",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-007_p3.jpg",
    },
    {
      id: "ST02-007_r1",
      artId: "ST02-007_r1",
      setCode: "PRB02",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-007_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST02-007_r1.jpg",
      imageId: "ST02-007_r1",
    },
  ],
  effect:
    '[Activate: Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character Look at 5 cards from the top of your deck; reveal up to 1 "Supernovas" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  i18n: prb02JewelryBonneySt02007PirateFoil007I18n,
};
