import type { CharacterCard } from "@tcg/op-types";
import { op11Bartolomeo055I18n } from "./055-bartolomeo.i18n.ts";

export const op11Bartolomeo055: CharacterCard = {
  id: "OP11-055",
  canonicalId: "OP11-055",
  slug: "bartolomeo/op11-055",
  name: "Bartolomeo",
  printings: [
    {
      id: "OP11-055",
      artId: "OP11-055",
      setCode: "OP11",
      collectorNumber: "055",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-055.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP11",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Supernovas Dressrosa"],
  attribute: "special",
  i18n: op11Bartolomeo055I18n,
};
