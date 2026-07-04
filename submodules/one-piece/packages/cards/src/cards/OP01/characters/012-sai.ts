import type { CharacterCard } from "@tcg/op-types";
import { op01Sai012I18n } from "./012-sai.i18n.ts";

export const op01Sai012: CharacterCard = {
  id: "OP01-012",
  canonicalId: "OP01-012",
  slug: "sai/op01-012",
  name: "Sai",
  printings: [
    {
      id: "OP01-012",
      artId: "OP01-012",
      setCode: "OP01",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-012.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Happosui Army"],
  attribute: "slash",
  i18n: op01Sai012I18n,
};
