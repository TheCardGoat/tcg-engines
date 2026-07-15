import type { CharacterCard } from "@tcg/op-types";
import { op02Doberman107I18n } from "./107-doberman.i18n.ts";

export const op02Doberman107: CharacterCard = {
  id: "OP02-107",
  canonicalId: "OP02-107",
  slug: "doberman",
  name: "Doberman",
  printings: [
    {
      id: "OP02-107",
      artId: "OP02-107",
      setCode: "OP02",
      collectorNumber: "107",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-107.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  effect: "NULL",
  i18n: op02Doberman107I18n,
};
