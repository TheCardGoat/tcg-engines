import type { CharacterCard } from "@tcg/op-types";
import { op02Dobon080I18n } from "./080-dobon.i18n.ts";

export const op02Dobon080: CharacterCard = {
  id: "OP02-080",
  canonicalId: "OP02-080",
  slug: "dobon",
  name: "Dobon",
  printings: [
    {
      id: "OP02-080",
      artId: "OP02-080",
      setCode: "OP02",
      collectorNumber: "080",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-080.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "strike",
  effect: "NULL",
  i18n: op02Dobon080I18n,
};
