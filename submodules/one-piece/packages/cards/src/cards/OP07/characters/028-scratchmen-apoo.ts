import type { CharacterCard } from "@tcg/op-types";
import { op07ScratchmenApoo028I18n } from "./028-scratchmen-apoo.i18n.ts";

export const op07ScratchmenApoo028: CharacterCard = {
  id: "OP07-028",
  canonicalId: "OP07-028",
  slug: "scratchmen-apoo/op07-028",
  name: "Scratchmen Apoo",
  printings: [
    {
      id: "OP07-028",
      artId: "OP07-028",
      setCode: "OP07",
      collectorNumber: "028",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-028.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP07",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["On-Air Pirates Supernovas"],
  attribute: "ranged",
  effect: "NULL",
  i18n: op07ScratchmenApoo028I18n,
};
