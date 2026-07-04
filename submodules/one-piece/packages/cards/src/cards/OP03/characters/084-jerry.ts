import type { CharacterCard } from "@tcg/op-types";
import { op03Jerry084I18n } from "./084-jerry.i18n.ts";

export const op03Jerry084: CharacterCard = {
  id: "OP03-084",
  canonicalId: "OP03-084",
  slug: "jerry",
  name: "Jerry",
  printings: [
    {
      id: "OP03-084",
      artId: "OP03-084",
      setCode: "OP03",
      collectorNumber: "084",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-084.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["CP6"],
  attribute: "strike",
  effect: "NULL",
  i18n: op03Jerry084I18n,
};
