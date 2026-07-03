import type { CharacterCard } from "@tcg/op-types";
import { op03Nero087I18n } from "./087-nero.i18n.ts";

export const op03Nero087: CharacterCard = {
  id: "OP03-087",
  canonicalId: "OP03-087",
  slug: "nero",
  name: "Nero",
  printings: [
    {
      id: "OP03-087",
      artId: "OP03-087",
      setCode: "OP03",
      collectorNumber: "087",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-087.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "ranged",
  effect: "NULL",
  i18n: op03Nero087I18n,
};
