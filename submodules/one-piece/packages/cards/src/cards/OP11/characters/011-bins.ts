import type { CharacterCard } from "@tcg/op-types";
import { op11Bins011I18n } from "./011-bins.i18n.ts";

export const op11Bins011: CharacterCard = {
  id: "OP11-011",
  canonicalId: "OP11-011",
  slug: "bins",
  name: "Bins",
  printings: [
    {
      id: "OP11-011",
      artId: "OP11-011",
      setCode: "OP11",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-011.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP11",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["FILM Neo Navy"],
  attribute: "special",
  i18n: op11Bins011I18n,
};
