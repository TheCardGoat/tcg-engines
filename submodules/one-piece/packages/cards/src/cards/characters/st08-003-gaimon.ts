import type { CharacterCard } from "@tcg/op-types";
import { st08Gaimon003I18n } from "./st08-003-gaimon.i18n.ts";
export const st08Gaimon003: CharacterCard = {
  id: "ST08-003",
  canonicalId: "ST08-003",
  slug: "gaimon/st08-003",
  name: "Gaimon",
  printings: [
    {
      id: "ST08-003",
      artId: "ST08-003",
      setCode: "ST08",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-003.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST08",
  traits: ["East Blue"],
  cost: 2,
  power: 4000,
  counter: 1000,
  attribute: "wisdom",
  i18n: st08Gaimon003I18n,
};
