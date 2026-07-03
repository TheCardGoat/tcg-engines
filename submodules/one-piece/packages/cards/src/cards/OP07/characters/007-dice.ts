import type { CharacterCard } from "@tcg/op-types";
import { op07Dice007I18n } from "./007-dice.i18n.ts";

export const op07Dice007: CharacterCard = {
  id: "OP07-007",
  canonicalId: "OP07-007",
  slug: "dice",
  name: "Dice",
  printings: [
    {
      id: "OP07-007",
      artId: "OP07-007",
      setCode: "OP07",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-007.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP07",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["FILM Grantesoro"],
  attribute: "strike",
  effect: "NULL",
  i18n: op07Dice007I18n,
};
