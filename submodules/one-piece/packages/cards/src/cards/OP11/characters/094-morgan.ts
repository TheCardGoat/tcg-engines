import type { CharacterCard } from "@tcg/op-types";
import { op11Morgan094I18n } from "./094-morgan.i18n.ts";

export const op11Morgan094: CharacterCard = {
  id: "OP11-094",
  canonicalId: "OP11-094",
  slug: "morgan/op11-094",
  name: "Morgan",
  printings: [
    {
      id: "OP11-094",
      artId: "OP11-094",
      setCode: "OP11",
      collectorNumber: "094",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-094.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP11",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  i18n: op11Morgan094I18n,
};
