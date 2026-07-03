import type { CharacterCard } from "@tcg/op-types";
import { op01ScratchmenApoo103I18n } from "./103-scratchmen-apoo.i18n.ts";

export const op01ScratchmenApoo103: CharacterCard = {
  id: "OP01-103",
  canonicalId: "OP01-103",
  slug: "scratchmen-apoo/op01-103",
  name: "Scratchmen Apoo",
  printings: [
    {
      id: "OP01-103",
      artId: "OP01-103",
      setCode: "OP01",
      collectorNumber: "103",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-103.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates On-Air Pirates"],
  attribute: "ranged",
  effect: "NULL",
  i18n: op01ScratchmenApoo103I18n,
};
