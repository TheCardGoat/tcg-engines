import type { CharacterCard } from "@tcg/op-types";
import { op10Franky014I18n } from "./014-franky.i18n.ts";

export const op10Franky014: CharacterCard = {
  id: "OP10-014",
  canonicalId: "OP10-014",
  slug: "franky/op10-014",
  name: "Franky",
  printings: [
    {
      id: "OP10-014",
      artId: "OP10-014",
      setCode: "OP10",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-014.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP10",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Animal Straw Hat Crew Punk Hazard"],
  attribute: "strike",
  i18n: op10Franky014I18n,
};
