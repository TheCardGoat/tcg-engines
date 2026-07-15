import type { CharacterCard } from "@tcg/op-types";
import { op12Inazuma083I18n } from "./083-inazuma.i18n.ts";

export const op12Inazuma083: CharacterCard = {
  id: "OP12-083",
  canonicalId: "OP12-083",
  slug: "inazuma/op12-083",
  name: "Inazuma",
  printings: [
    {
      id: "OP12-083",
      artId: "OP12-083",
      setCode: "OP12",
      collectorNumber: "083",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-083_Qk2gX9w.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP12",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Revolutionary Army"],
  attribute: "slash",
  i18n: op12Inazuma083I18n,
};
