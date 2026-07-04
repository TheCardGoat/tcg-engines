import type { CharacterCard } from "@tcg/op-types";
import { op11Ryuboshi113I18n } from "./113-ryuboshi.i18n.ts";

export const op11Ryuboshi113: CharacterCard = {
  id: "OP11-113",
  canonicalId: "OP11-113",
  slug: "ryuboshi",
  name: "Ryuboshi",
  printings: [
    {
      id: "OP11-113",
      artId: "OP11-113",
      setCode: "OP11",
      collectorNumber: "113",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-113.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP11",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "slash",
  i18n: op11Ryuboshi113I18n,
};
