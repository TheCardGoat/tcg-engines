import type { CharacterCard } from "@tcg/op-types";
import { op03Alvida023I18n } from "./023-alvida.i18n.ts";

export const op03Alvida023: CharacterCard = {
  id: "OP03-023",
  canonicalId: "OP03-023",
  slug: "alvida/op03-023",
  name: "Alvida",
  printings: [
    {
      id: "OP03-023",
      artId: "OP03-023",
      setCode: "OP03",
      collectorNumber: "023",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-023.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["East Blue Alvida Pirates"],
  attribute: "strike",
  effect: "NULL",
  i18n: op03Alvida023I18n,
};
