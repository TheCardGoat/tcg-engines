import type { CharacterCard } from "@tcg/op-types";
import { op02Usopp028I18n } from "./028-usopp.i18n.ts";

export const op02Usopp028: CharacterCard = {
  id: "OP02-028",
  canonicalId: "OP02-028",
  slug: "usopp/op02-028",
  name: "Usopp",
  printings: [
    {
      id: "OP02-028",
      artId: "OP02-028",
      setCode: "OP02",
      collectorNumber: "028",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-028.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP02",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Film Straw Hat Crew"],
  attribute: "ranged",
  i18n: op02Usopp028I18n,
};
