import type { CharacterCard } from "@tcg/op-types";
import { op01Wire053I18n } from "./053-wire.i18n.ts";

export const op01Wire053: CharacterCard = {
  id: "OP01-053",
  canonicalId: "OP01-053",
  slug: "wire/op01-053",
  name: "Wire",
  printings: [
    {
      id: "OP01-053",
      artId: "OP01-053",
      setCode: "OP01",
      collectorNumber: "053",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-053.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "slash",
  i18n: op01Wire053I18n,
};
