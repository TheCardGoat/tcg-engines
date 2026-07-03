import type { CharacterCard } from "@tcg/op-types";
import { op08CharlotteSmoothie065I18n } from "./065-charlotte-smoothie.i18n.ts";

export const op08CharlotteSmoothie065: CharacterCard = {
  id: "OP08-065",
  canonicalId: "OP08-065",
  slug: "charlotte-smoothie/op08-065",
  name: "Charlotte Smoothie",
  printings: [
    {
      id: "OP08-065",
      artId: "OP08-065",
      setCode: "OP08",
      collectorNumber: "065",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-065.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP08",
  cost: 7,
  power: 9000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect: "NULL",
  i18n: op08CharlotteSmoothie065I18n,
};
