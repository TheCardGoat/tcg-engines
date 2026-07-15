import type { CharacterCard } from "@tcg/op-types";
import { op01Marco023I18n } from "./023-marco.i18n.ts";

export const op01Marco023: CharacterCard = {
  id: "OP01-023",
  canonicalId: "OP01-023",
  slug: "marco/op01-023",
  name: "Marco",
  printings: [
    {
      id: "OP01-023",
      artId: "OP01-023",
      setCode: "OP01",
      collectorNumber: "023",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-023.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Former Whitebeard Pirates"],
  attribute: "special",
  effect: "NULL",
  i18n: op01Marco023I18n,
};
