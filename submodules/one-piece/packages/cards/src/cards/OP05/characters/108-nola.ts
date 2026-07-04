import type { CharacterCard } from "@tcg/op-types";
import { op05Nola108I18n } from "./108-nola.i18n.ts";

export const op05Nola108: CharacterCard = {
  id: "OP05-108",
  canonicalId: "OP05-108",
  slug: "nola",
  name: "Nola",
  printings: [
    {
      id: "OP05-108",
      artId: "OP05-108",
      setCode: "OP05",
      collectorNumber: "108",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-108.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP05",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Animal Sky Island"],
  attribute: "strike",
  effect: "NULL",
  i18n: op05Nola108I18n,
};
