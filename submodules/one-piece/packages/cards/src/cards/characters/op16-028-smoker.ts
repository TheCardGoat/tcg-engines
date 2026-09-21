import type { CharacterCard } from "@tcg/op-types";
import { op16Smoker028I18n } from "./op16-028-smoker.i18n.ts";

export const op16Smoker028: CharacterCard = {
  id: "OP16-028",
  canonicalId: "OP16-028",
  slug: "smoker/op16-028",
  name: "Smoker",
  printings: [
    {
      id: "OP16-028",
      artId: "OP16-028",
      setCode: "OP16",
      collectorNumber: "028",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-028_gMBuQs0.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP16",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "special",
  i18n: op16Smoker028I18n,
};
