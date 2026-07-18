import type { CharacterCard } from "@tcg/op-types";
import { op01Shinobu043I18n } from "./043-shinobu.i18n.ts";

export const op01Shinobu043: CharacterCard = {
  id: "OP01-043",
  canonicalId: "OP01-043",
  slug: "shinobu",
  name: "Shinobu",
  printings: [
    {
      id: "OP01-043",
      artId: "OP01-043",
      setCode: "OP01",
      collectorNumber: "043",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-043.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "special",
  i18n: op01Shinobu043I18n,
};
