import type { CharacterCard } from "@tcg/op-types";
import { op12Buggy049I18n } from "./049-buggy.i18n.ts";

export const op12Buggy049: CharacterCard = {
  id: "OP12-049",
  canonicalId: "OP12-049",
  slug: "buggy/op12-049",
  name: "Buggy",
  printings: [
    {
      id: "OP12-049",
      artId: "OP12-049",
      setCode: "OP12",
      collectorNumber: "049",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-049_LbDe4tU.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["The Four Emperors Cross Guild"],
  attribute: "slash",
  i18n: op12Buggy049I18n,
};
