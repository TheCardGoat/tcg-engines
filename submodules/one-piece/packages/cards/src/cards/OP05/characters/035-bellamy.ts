import type { CharacterCard } from "@tcg/op-types";
import { op05Bellamy035I18n } from "./035-bellamy.i18n.ts";

export const op05Bellamy035: CharacterCard = {
  id: "OP05-035",
  canonicalId: "OP05-035",
  slug: "bellamy/op05-035",
  name: "Bellamy",
  printings: [
    {
      id: "OP05-035",
      artId: "OP05-035",
      setCode: "OP05",
      collectorNumber: "035",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-035.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP05",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  effect: "NULL",
  i18n: op05Bellamy035I18n,
};
