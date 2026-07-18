import type { CharacterCard } from "@tcg/op-types";
import { op03Namule007I18n } from "./007-namule.i18n.ts";

export const op03Namule007: CharacterCard = {
  id: "OP03-007",
  canonicalId: "OP03-007",
  slug: "namule/op03-007",
  name: "Namule",
  printings: [
    {
      id: "OP03-007",
      artId: "OP03-007",
      setCode: "OP03",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-007.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Fish-Man Whitebeard Pirates"],
  attribute: "strike",
  i18n: op03Namule007I18n,
};
