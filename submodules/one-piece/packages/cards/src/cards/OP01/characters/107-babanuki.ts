import type { CharacterCard } from "@tcg/op-types";
import { op01Babanuki107I18n } from "./107-babanuki.i18n.ts";

export const op01Babanuki107: CharacterCard = {
  id: "OP01-107",
  canonicalId: "OP01-107",
  slug: "babanuki",
  name: "Babanuki",
  printings: [
    {
      id: "OP01-107",
      artId: "OP01-107",
      setCode: "OP01",
      collectorNumber: "107",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-107.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates SMILE"],
  attribute: "ranged",
  effect: "NULL",
  i18n: op01Babanuki107I18n,
};
