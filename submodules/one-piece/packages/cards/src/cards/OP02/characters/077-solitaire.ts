import type { CharacterCard } from "@tcg/op-types";
import { op02Solitaire077I18n } from "./077-solitaire.i18n.ts";

export const op02Solitaire077: CharacterCard = {
  id: "OP02-077",
  canonicalId: "OP02-077",
  slug: "solitaire",
  name: "Solitaire",
  printings: [
    {
      id: "OP02-077",
      artId: "OP02-077",
      setCode: "OP02",
      collectorNumber: "077",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-077.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP02",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "slash",
  i18n: op02Solitaire077I18n,
};
