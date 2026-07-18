import type { CharacterCard } from "@tcg/op-types";
import { op02Thatch007I18n } from "./007-thatch.i18n.ts";

export const op02Thatch007: CharacterCard = {
  id: "OP02-007",
  canonicalId: "OP02-007",
  slug: "thatch/op02-007",
  name: "Thatch",
  printings: [
    {
      id: "OP02-007",
      artId: "OP02-007",
      setCode: "OP02",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-007.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP02",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "wisdom",
  i18n: op02Thatch007I18n,
};
