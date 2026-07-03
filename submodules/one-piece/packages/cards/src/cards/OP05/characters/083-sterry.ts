import type { CharacterCard } from "@tcg/op-types";
import { op05Sterry083I18n } from "./083-sterry.i18n.ts";

export const op05Sterry083: CharacterCard = {
  id: "OP05-083",
  canonicalId: "OP05-083",
  slug: "sterry/op05-083",
  name: "Sterry",
  printings: [
    {
      id: "OP05-083",
      artId: "OP05-083",
      setCode: "OP05",
      collectorNumber: "083",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-083.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Goa Kingdom"],
  attribute: "wisdom",
  effect: "NULL",
  i18n: op05Sterry083I18n,
};
