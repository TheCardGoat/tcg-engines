import type { CharacterCard } from "@tcg/op-types";
import { op11Mocha015I18n } from "./015-mocha.i18n.ts";

export const op11Mocha015: CharacterCard = {
  id: "OP11-015",
  canonicalId: "OP11-015",
  slug: "mocha/op11-015",
  name: "Mocha",
  printings: [
    {
      id: "OP11-015",
      artId: "OP11-015",
      setCode: "OP11",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-015.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP11",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Punk Hazard"],
  attribute: "wisdom",
  i18n: op11Mocha015I18n,
};
