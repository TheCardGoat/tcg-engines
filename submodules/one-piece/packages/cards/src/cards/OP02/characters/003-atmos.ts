import type { CharacterCard } from "@tcg/op-types";
import { op02Atmos003I18n } from "./003-atmos.i18n.ts";

export const op02Atmos003: CharacterCard = {
  id: "OP02-003",
  canonicalId: "OP02-003",
  slug: "atmos/op02-003",
  name: "Atmos",
  printings: [
    {
      id: "OP02-003",
      artId: "OP02-003",
      setCode: "OP02",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-003.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP02",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  i18n: op02Atmos003I18n,
};
