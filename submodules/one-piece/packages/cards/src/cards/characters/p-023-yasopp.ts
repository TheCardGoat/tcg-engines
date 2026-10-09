import type { CharacterCard } from "@tcg/op-types";
import { pYasopp023I18n } from "./p-023-yasopp.i18n.ts";
export const pYasopp023: CharacterCard = {
  id: "P-023",
  canonicalId: "P-023",
  slug: "yasopp/p-023",
  name: "Yasopp",
  printings: [
    {
      id: "P-023",
      artId: "P-023",
      setCode: "P",
      collectorNumber: "023",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-023.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["FILM", "Red-Haired Pirates"],
  attribute: "ranged",
  i18n: pYasopp023I18n,
};
