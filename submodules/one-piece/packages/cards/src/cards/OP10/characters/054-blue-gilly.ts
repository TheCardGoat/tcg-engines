import type { CharacterCard } from "@tcg/op-types";
import { op10BlueGilly054I18n } from "./054-blue-gilly.i18n.ts";

export const op10BlueGilly054: CharacterCard = {
  id: "OP10-054",
  canonicalId: "OP10-054",
  slug: "blue-gilly",
  name: "Blue Gilly",
  printings: [
    {
      id: "OP10-054",
      artId: "OP10-054",
      setCode: "OP10",
      collectorNumber: "054",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-054.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP10",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "strike",
  i18n: op10BlueGilly054I18n,
};
