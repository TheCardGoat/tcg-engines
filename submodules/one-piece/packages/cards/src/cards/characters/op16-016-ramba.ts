import type { CharacterCard } from "@tcg/op-types";
import { op16Ramba016I18n } from "./op16-016-ramba.i18n.ts";

export const op16Ramba016: CharacterCard = {
  id: "OP16-016",
  canonicalId: "OP16-016",
  slug: "ramba/op16-016",
  name: "Ramba",
  printings: [
    {
      id: "OP16-016",
      artId: "OP16-016",
      setCode: "OP16",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-016_d7TtiJH.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP16",
  cost: 6,
  power: 8000,
  traits: ["Whitebeard Pirates Allies"],
  attribute: "slash",
  i18n: op16Ramba016I18n,
};
