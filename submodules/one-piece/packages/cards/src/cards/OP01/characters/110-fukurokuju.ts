import type { CharacterCard } from "@tcg/op-types";
import { op01Fukurokuju110I18n } from "./110-fukurokuju.i18n.ts";

export const op01Fukurokuju110: CharacterCard = {
  id: "OP01-110",
  canonicalId: "OP01-110",
  slug: "fukurokuju",
  name: "Fukurokuju",
  printings: [
    {
      id: "OP01-110",
      artId: "OP01-110",
      setCode: "OP01",
      collectorNumber: "110",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-110.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates Land of Wano"],
  attribute: "special",
  i18n: op01Fukurokuju110I18n,
};
