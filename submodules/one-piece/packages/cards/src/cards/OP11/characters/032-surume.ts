import type { CharacterCard } from "@tcg/op-types";
import { op11Surume032I18n } from "./032-surume.i18n.ts";

export const op11Surume032: CharacterCard = {
  id: "OP11-032",
  canonicalId: "OP11-032",
  slug: "surume",
  name: "Surume",
  printings: [
    {
      id: "OP11-032",
      artId: "OP11-032",
      setCode: "OP11",
      collectorNumber: "032",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-032.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP11",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Animal Fish-Man Island"],
  attribute: "strike",
  i18n: op11Surume032I18n,
};
