import type { CharacterCard } from "@tcg/op-types";
import { op01Otsuru036I18n } from "./036-otsuru.i18n.ts";

export const op01Otsuru036: CharacterCard = {
  id: "OP01-036",
  canonicalId: "OP01-036",
  slug: "otsuru",
  name: "Otsuru",
  printings: [
    {
      id: "OP01-036",
      artId: "OP01-036",
      setCode: "OP01",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-036.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "wisdom",
  i18n: op01Otsuru036I18n,
};
