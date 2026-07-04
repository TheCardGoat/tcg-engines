import type { CharacterCard } from "@tcg/op-types";
import { op01Krieg066I18n } from "./066-krieg.i18n.ts";

export const op01Krieg066: CharacterCard = {
  id: "OP01-066",
  canonicalId: "OP01-066",
  slug: "krieg/op01-066",
  name: "Krieg",
  printings: [
    {
      id: "OP01-066",
      artId: "OP01-066",
      setCode: "OP01",
      collectorNumber: "066",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-066.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Krieg Pirates"],
  attribute: "slash",
  effect: "NULL",
  i18n: op01Krieg066I18n,
};
