import type { CharacterCard } from "@tcg/op-types";
import { op03KiwiMozu061I18n } from "./061-kiwi-mozu.i18n.ts";

export const op03KiwiMozu061: CharacterCard = {
  id: "OP03-061",
  canonicalId: "OP03-061",
  slug: "kiwi-mozu",
  name: "Kiwi & Mozu",
  printings: [
    {
      id: "OP03-061",
      artId: "OP03-061",
      setCode: "OP03",
      collectorNumber: "061",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-061.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Water Seven The Franky Family"],
  attribute: "slash",
  effect: "NULL",
  i18n: op03KiwiMozu061I18n,
};
