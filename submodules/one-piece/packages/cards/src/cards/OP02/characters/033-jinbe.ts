import type { CharacterCard } from "@tcg/op-types";
import { op02Jinbe033I18n } from "./033-jinbe.i18n.ts";

export const op02Jinbe033: CharacterCard = {
  id: "OP02-033",
  canonicalId: "OP02-033",
  slug: "jinbe/op02-033",
  name: "Jinbe",
  printings: [
    {
      id: "OP02-033",
      artId: "OP02-033",
      setCode: "OP02",
      collectorNumber: "033",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-033.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Film Fish-Man Straw Hat Crew"],
  attribute: "strike",
  effect: "NULL",
  i18n: op02Jinbe033I18n,
};
