import type { CharacterCard } from "@tcg/op-types";
import { op10Cavendish105I18n } from "./105-cavendish.i18n.ts";

export const op10Cavendish105: CharacterCard = {
  id: "OP10-105",
  canonicalId: "OP10-105",
  slug: "cavendish/op10-105",
  name: "Cavendish",
  printings: [
    {
      id: "OP10-105",
      artId: "OP10-105",
      setCode: "OP10",
      collectorNumber: "105",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-105.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP10",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Beautiful Pirates Supernovas Dressrosa"],
  attribute: "slash",
  i18n: op10Cavendish105I18n,
};
