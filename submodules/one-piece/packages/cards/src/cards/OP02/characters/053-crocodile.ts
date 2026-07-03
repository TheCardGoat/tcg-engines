import type { CharacterCard } from "@tcg/op-types";
import { op02Crocodile053I18n } from "./053-crocodile.i18n.ts";

export const op02Crocodile053: CharacterCard = {
  id: "OP02-053",
  canonicalId: "OP02-053",
  slug: "crocodile/op02-053",
  name: "Crocodile",
  printings: [
    {
      id: "OP02-053",
      artId: "OP02-053",
      setCode: "OP02",
      collectorNumber: "053",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-053.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP02",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Impel Down Former Baroque Works"],
  attribute: "special",
  effect: "NULL",
  i18n: op02Crocodile053I18n,
};
