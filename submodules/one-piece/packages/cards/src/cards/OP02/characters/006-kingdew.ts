import type { CharacterCard } from "@tcg/op-types";
import { op02Kingdew006I18n } from "./006-kingdew.i18n.ts";

export const op02Kingdew006: CharacterCard = {
  id: "OP02-006",
  canonicalId: "OP02-006",
  slug: "kingdew/op02-006",
  name: "Kingdew",
  printings: [
    {
      id: "OP02-006",
      artId: "OP02-006",
      setCode: "OP02",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-006.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP02",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  i18n: op02Kingdew006I18n,
};
