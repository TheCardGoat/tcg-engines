import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Oars101I18n } from "./101-oars.i18n.ts";

export const op14eb04Oars101: CharacterCard = {
  id: "OP14-101",
  canonicalId: "OP14-101",
  slug: "oars/op14-101",
  name: "Oars",
  printings: [
    {
      id: "OP14-101",
      artId: "OP14-101",
      setCode: "OP14EB04",
      collectorNumber: "101",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-101_hOMo9UV.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 8,
  power: 10000,
  counter: 1000,
  traits: ["Giant", "Thriller Bark Pirates"],
  attribute: "strike",
  i18n: op14eb04Oars101I18n,
};
