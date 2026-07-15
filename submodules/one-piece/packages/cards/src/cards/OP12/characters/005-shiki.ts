import type { CharacterCard } from "@tcg/op-types";
import { op12Shiki005I18n } from "./005-shiki.i18n.ts";

export const op12Shiki005: CharacterCard = {
  id: "OP12-005",
  canonicalId: "OP12-005",
  slug: "shiki/op12-005",
  name: "Shiki",
  printings: [
    {
      id: "OP12-005",
      artId: "OP12-005",
      setCode: "OP12",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-005_CgKdL3G.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP12",
  cost: 8,
  power: 10000,
  counter: 1000,
  traits: ["FILM Golden Lion Pirates"],
  attribute: "slash",
  i18n: op12Shiki005I18n,
};
