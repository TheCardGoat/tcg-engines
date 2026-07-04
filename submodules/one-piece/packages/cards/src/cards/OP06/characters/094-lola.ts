import type { CharacterCard } from "@tcg/op-types";
import { op06Lola094I18n } from "./094-lola.i18n.ts";

export const op06Lola094: CharacterCard = {
  id: "OP06-094",
  canonicalId: "OP06-094",
  slug: "lola",
  name: "Lola",
  printings: [
    {
      id: "OP06-094",
      artId: "OP06-094",
      setCode: "OP06",
      collectorNumber: "094",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-094.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP06",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "slash",
  i18n: op06Lola094I18n,
};
