import type { CharacterCard } from "@tcg/op-types";
import { op02Blugori084I18n } from "./084-blugori.i18n.ts";

export const op02Blugori084: CharacterCard = {
  id: "OP02-084",
  canonicalId: "OP02-084",
  slug: "blugori",
  name: "Blugori",
  printings: [
    {
      id: "OP02-084",
      artId: "OP02-084",
      setCode: "OP02",
      collectorNumber: "084",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-084.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Animal Impel Down"],
  attribute: "slash",
  i18n: op02Blugori084I18n,
};
