import type { CharacterCard } from "@tcg/op-types";
import { op03Genzo046I18n } from "./046-genzo.i18n.ts";

export const op03Genzo046: CharacterCard = {
  id: "OP03-046",
  canonicalId: "OP03-046",
  slug: "genzo",
  name: "Genzo",
  printings: [
    {
      id: "OP03-046",
      artId: "OP03-046",
      setCode: "OP03",
      collectorNumber: "046",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-046.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  i18n: op03Genzo046I18n,
};
