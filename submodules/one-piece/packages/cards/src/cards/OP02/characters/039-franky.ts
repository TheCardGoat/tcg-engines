import type { CharacterCard } from "@tcg/op-types";
import { op02Franky039I18n } from "./039-franky.i18n.ts";

export const op02Franky039: CharacterCard = {
  id: "OP02-039",
  canonicalId: "OP02-039",
  slug: "franky/op02-039",
  name: "Franky",
  printings: [
    {
      id: "OP02-039",
      artId: "OP02-039",
      setCode: "OP02",
      collectorNumber: "039",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-039.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP02",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Film Straw Hat Crew"],
  attribute: "special",
  i18n: op02Franky039I18n,
};
