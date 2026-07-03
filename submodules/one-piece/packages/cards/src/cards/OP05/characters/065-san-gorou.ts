import type { CharacterCard } from "@tcg/op-types";
import { op05SanGorou065I18n } from "./065-san-gorou.i18n.ts";

export const op05SanGorou065: CharacterCard = {
  id: "OP05-065",
  canonicalId: "OP05-065",
  slug: "san-gorou",
  name: "San-Gorou",
  printings: [
    {
      id: "OP05-065",
      artId: "OP05-065",
      setCode: "OP05",
      collectorNumber: "065",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-065.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP05",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect: "NULL",
  i18n: op05SanGorou065I18n,
};
