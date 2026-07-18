import type { CharacterCard } from "@tcg/op-types";
import { op03Momoo035I18n } from "./035-momoo.i18n.ts";

export const op03Momoo035: CharacterCard = {
  id: "OP03-035",
  canonicalId: "OP03-035",
  slug: "momoo",
  name: "Momoo",
  printings: [
    {
      id: "OP03-035",
      artId: "OP03-035",
      setCode: "OP03",
      collectorNumber: "035",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-035.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Animal East Blue"],
  attribute: "strike",
  i18n: op03Momoo035I18n,
};
