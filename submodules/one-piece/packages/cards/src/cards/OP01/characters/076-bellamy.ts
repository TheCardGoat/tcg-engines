import type { CharacterCard } from "@tcg/op-types";
import { op01Bellamy076I18n } from "./076-bellamy.i18n.ts";

export const op01Bellamy076: CharacterCard = {
  id: "OP01-076",
  canonicalId: "OP01-076",
  slug: "bellamy/op01-076",
  name: "Bellamy",
  printings: [
    {
      id: "OP01-076",
      artId: "OP01-076",
      setCode: "OP01",
      collectorNumber: "076",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-076.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "strike",
  i18n: op01Bellamy076I18n,
};
