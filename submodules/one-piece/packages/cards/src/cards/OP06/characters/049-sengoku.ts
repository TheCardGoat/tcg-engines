import type { CharacterCard } from "@tcg/op-types";
import { op06Sengoku049I18n } from "./049-sengoku.i18n.ts";

export const op06Sengoku049: CharacterCard = {
  id: "OP06-049",
  canonicalId: "OP06-049",
  slug: "sengoku/op06-049",
  name: "Sengoku",
  printings: [
    {
      id: "OP06-049",
      artId: "OP06-049",
      setCode: "OP06",
      collectorNumber: "049",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-049.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP06",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  i18n: op06Sengoku049I18n,
};
