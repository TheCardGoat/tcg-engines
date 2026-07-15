import type { CharacterCard } from "@tcg/op-types";
import { op02Komille097I18n } from "./097-komille.i18n.ts";

export const op02Komille097: CharacterCard = {
  id: "OP02-097",
  canonicalId: "OP02-097",
  slug: "komille",
  name: "Komille",
  printings: [
    {
      id: "OP02-097",
      artId: "OP02-097",
      setCode: "OP02",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-097.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect: "NULL",
  i18n: op02Komille097I18n,
};
