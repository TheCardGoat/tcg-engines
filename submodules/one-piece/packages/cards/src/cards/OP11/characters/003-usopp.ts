import type { CharacterCard } from "@tcg/op-types";
import { op11Usopp003I18n } from "./003-usopp.i18n.ts";

export const op11Usopp003: CharacterCard = {
  id: "OP11-003",
  canonicalId: "OP11-003",
  slug: "usopp/op11-003",
  name: "Usopp",
  printings: [
    {
      id: "OP11-003",
      artId: "OP11-003",
      setCode: "OP11",
      collectorNumber: "003",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-003.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP11",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "ranged",
  i18n: op11Usopp003I18n,
};
