import type { CharacterCard } from "@tcg/op-types";
import { op02LittleoarsJr020I18n } from "./020-littleoars-jr.i18n.ts";

export const op02LittleoarsJr020: CharacterCard = {
  id: "OP02-020",
  canonicalId: "OP02-020",
  slug: "littleoars-jr/op02-020",
  name: "LittleOars Jr.",
  printings: [
    {
      id: "OP02-020",
      artId: "OP02-020",
      setCode: "OP02",
      collectorNumber: "020",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-020.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP02",
  cost: 7,
  power: 9000,
  counter: 1000,
  traits: ["Giant Whitebeard Pirates Allies"],
  attribute: "strike",
  effect: "NULL",
  i18n: op02LittleoarsJr020I18n,
};
