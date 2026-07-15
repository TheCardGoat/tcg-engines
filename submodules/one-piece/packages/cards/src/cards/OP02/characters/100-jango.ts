import type { CharacterCard } from "@tcg/op-types";
import { op02Jango100I18n } from "./100-jango.i18n.ts";

export const op02Jango100: CharacterCard = {
  id: "OP02-100",
  canonicalId: "OP02-100",
  slug: "jango/op02-100",
  name: "Jango",
  printings: [
    {
      id: "OP02-100",
      artId: "OP02-100",
      setCode: "OP02",
      collectorNumber: "100",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-100.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect: "If you have [Fullbody], this Character cannot be K.O.'d in battle.",
  i18n: op02Jango100I18n,
};
