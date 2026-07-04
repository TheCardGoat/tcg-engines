import type { CharacterCard } from "@tcg/op-types";
import { op11Bogard093I18n } from "./093-bogard.i18n.ts";

export const op11Bogard093: CharacterCard = {
  id: "OP11-093",
  canonicalId: "OP11-093",
  slug: "bogard",
  name: "Bogard",
  printings: [
    {
      id: "OP11-093",
      artId: "OP11-093",
      setCode: "OP11",
      collectorNumber: "093",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-093.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP11",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "slash",
  i18n: op11Bogard093I18n,
};
