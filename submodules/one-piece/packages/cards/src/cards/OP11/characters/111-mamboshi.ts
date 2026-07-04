import type { CharacterCard } from "@tcg/op-types";
import { op11Mamboshi111I18n } from "./111-mamboshi.i18n.ts";

export const op11Mamboshi111: CharacterCard = {
  id: "OP11-111",
  canonicalId: "OP11-111",
  slug: "mamboshi",
  name: "Mamboshi",
  printings: [
    {
      id: "OP11-111",
      artId: "OP11-111",
      setCode: "OP11",
      collectorNumber: "111",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-111.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP11",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "slash",
  i18n: op11Mamboshi111I18n,
};
