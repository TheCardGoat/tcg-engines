import type { CharacterCard } from "@tcg/op-types";
import { op09Morley113I18n } from "./113-morley.i18n.ts";

export const op09Morley113: CharacterCard = {
  id: "OP09-113",
  canonicalId: "OP09-113",
  slug: "morley/op09-113",
  name: "Morley",
  printings: [
    {
      id: "OP09-113",
      artId: "OP09-113",
      setCode: "OP09",
      collectorNumber: "113",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-113.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP09",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Giant Revolutionary Army"],
  attribute: "special",
  i18n: op09Morley113I18n,
};
