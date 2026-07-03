import type { CharacterCard } from "@tcg/op-types";
import { op14eb04JewelryBonney007I18n } from "./007-jewelry-bonney.i18n.ts";

export const op14eb04JewelryBonney007: CharacterCard = {
  id: "OP14-007",
  canonicalId: "OP14-007",
  slug: "jewelry-bonney/op14-007",
  name: "Jewelry Bonney",
  printings: [
    {
      id: "OP14-007",
      artId: "OP14-007",
      setCode: "OP14EB04",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-007_po8buow.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  i18n: op14eb04JewelryBonney007I18n,
};
