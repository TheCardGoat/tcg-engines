import type { CharacterCard } from "@tcg/op-types";
import { op11Saldeath064I18n } from "./064-saldeath.i18n.ts";

export const op11Saldeath064: CharacterCard = {
  id: "OP11-064",
  canonicalId: "OP11-064",
  slug: "saldeath/op11-064",
  name: "Saldeath",
  printings: [
    {
      id: "OP11-064",
      artId: "OP11-064",
      setCode: "OP11",
      collectorNumber: "064",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-064.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP11",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Impel Down"],
  attribute: "wisdom",
  i18n: op11Saldeath064I18n,
};
