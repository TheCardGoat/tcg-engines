import type { CharacterCard } from "@tcg/op-types";
import { op16Curiel004I18n } from "./op16-004-curiel.i18n.ts";

export const op16Curiel004: CharacterCard = {
  id: "OP16-004",
  canonicalId: "OP16-004",
  slug: "curiel/op16-004",
  name: "Curiel",
  printings: [
    {
      id: "OP16-004",
      artId: "OP16-004",
      setCode: "OP16",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-004_Ai1HHLt.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP16",
  cost: 7,
  power: 8000,
  counter: 2000,
  traits: ["Whitebeard Pirates"],
  attribute: "ranged",
  i18n: op16Curiel004I18n,
};
