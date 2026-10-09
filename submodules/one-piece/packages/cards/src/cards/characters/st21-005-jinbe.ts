import type { CharacterCard } from "@tcg/op-types";
import { st21Jinbe005I18n } from "./st21-005-jinbe.i18n.ts";
export const st21Jinbe005: CharacterCard = {
  id: "ST21-005",
  canonicalId: "ST21-005",
  slug: "jinbe/st21-005",
  name: "Jinbe",
  printings: [
    {
      id: "ST21-005",
      artId: "ST21-005",
      setCode: "ST21",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST21-005.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST21",
  cost: 2,
  traits: ["Fish-Man", "Straw Hat Crew"],
  power: 4000,
  attribute: "strike",
  counter: 1000,
  i18n: st21Jinbe005I18n,
};
