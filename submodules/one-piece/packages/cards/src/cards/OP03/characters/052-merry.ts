import type { CharacterCard } from "@tcg/op-types";
import { op03Merry052I18n } from "./052-merry.i18n.ts";

export const op03Merry052: CharacterCard = {
  id: "OP03-052",
  canonicalId: "OP03-052",
  slug: "merry",
  name: "Merry",
  printings: [
    {
      id: "OP03-052",
      artId: "OP03-052",
      setCode: "OP03",
      collectorNumber: "052",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-052.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect: "NULL",
  i18n: op03Merry052I18n,
};
