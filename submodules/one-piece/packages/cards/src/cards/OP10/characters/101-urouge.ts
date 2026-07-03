import type { CharacterCard } from "@tcg/op-types";
import { op10Urouge101I18n } from "./101-urouge.i18n.ts";

export const op10Urouge101: CharacterCard = {
  id: "OP10-101",
  canonicalId: "OP10-101",
  slug: "urouge/op10-101",
  name: "Urouge",
  printings: [
    {
      id: "OP10-101",
      artId: "OP10-101",
      setCode: "OP10",
      collectorNumber: "101",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-101.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Fallen Monk Pirates Supernovas"],
  attribute: "strike",
  i18n: op10Urouge101I18n,
};
