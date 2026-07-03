import type { CharacterCard } from "@tcg/op-types";
import { op03Buggy032I18n } from "./032-buggy.i18n.ts";

export const op03Buggy032: CharacterCard = {
  id: "OP03-032",
  canonicalId: "OP03-032",
  slug: "buggy/op03-032",
  name: "Buggy",
  printings: [
    {
      id: "OP03-032",
      artId: "OP03-032",
      setCode: "OP03",
      collectorNumber: "032",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-032_EIda3bg.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  power: 5000,
  traits: ["Buggy Pirates East Blue"],
  attribute: "slash",
  effect: 'This Character cannot be K.O.\'d in battle by "Slash" attribute cards.',
  i18n: op03Buggy032I18n,
};
