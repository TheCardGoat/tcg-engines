import type { CharacterCard } from "@tcg/op-types";
import { op04Rokki054I18n } from "./054-rokki.i18n.ts";

export const op04Rokki054: CharacterCard = {
  id: "OP04-054",
  canonicalId: "OP04-054",
  slug: "rokki",
  name: "Rokki",
  printings: [
    {
      id: "OP04-054",
      artId: "OP04-054",
      setCode: "OP04",
      collectorNumber: "054",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-054.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP04",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Giant", "Animal Kingdom Pirates"],
  attribute: "strike",
  i18n: op04Rokki054I18n,
};
