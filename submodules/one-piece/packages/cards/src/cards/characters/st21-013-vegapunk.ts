import type { CharacterCard } from "@tcg/op-types";
import { st21Vegapunk013I18n } from "./st21-013-vegapunk.i18n.ts";
export const st21Vegapunk013: CharacterCard = {
  id: "ST21-013",
  canonicalId: "ST21-013",
  slug: "vegapunk/st21-013",
  name: "Vegapunk",
  printings: [
    {
      id: "ST21-013",
      artId: "ST21-013",
      setCode: "ST21",
      collectorNumber: "013",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST21-013.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST21",
  cost: 1,
  traits: ["Scientist", "Egghead"],
  power: 3000,
  attribute: "wisdom",
  counter: 1000,
  i18n: st21Vegapunk013I18n,
};
