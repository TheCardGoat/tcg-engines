import type { CharacterCard } from "@tcg/op-types";
import { op05Holly110I18n } from "./110-holly.i18n.ts";

export const op05Holly110: CharacterCard = {
  id: "OP05-110",
  canonicalId: "OP05-110",
  slug: "holly",
  name: "Holly",
  printings: [
    {
      id: "OP05-110",
      artId: "OP05-110",
      setCode: "OP05",
      collectorNumber: "110",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-110.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP05",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Animal Sky Island"],
  attribute: "strike",
  effect: "NULL",
  i18n: op05Holly110I18n,
};
