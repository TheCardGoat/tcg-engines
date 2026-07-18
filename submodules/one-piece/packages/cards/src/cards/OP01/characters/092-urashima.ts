import type { CharacterCard } from "@tcg/op-types";
import { op01Urashima092I18n } from "./092-urashima.i18n.ts";

export const op01Urashima092: CharacterCard = {
  id: "OP01-092",
  canonicalId: "OP01-092",
  slug: "urashima",
  name: "Urashima",
  printings: [
    {
      id: "OP01-092",
      artId: "OP01-092",
      setCode: "OP01",
      collectorNumber: "092",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-092.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 7,
  power: 9000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "strike",
  i18n: op01Urashima092I18n,
};
