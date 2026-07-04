import type { CharacterCard } from "@tcg/op-types";
import { op03Camie101I18n } from "./101-camie.i18n.ts";

export const op03Camie101: CharacterCard = {
  id: "OP03-101",
  canonicalId: "OP03-101",
  slug: "camie/op03-101",
  name: "Camie",
  printings: [
    {
      id: "OP03-101",
      artId: "OP03-101",
      setCode: "OP03",
      collectorNumber: "101",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-101.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  effect: "NULL",
  i18n: op03Camie101I18n,
};
