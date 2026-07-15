import type { CharacterCard } from "@tcg/op-types";
import { op11CharlotteChiffon105I18n } from "./105-charlotte-chiffon.i18n.ts";

export const op11CharlotteChiffon105: CharacterCard = {
  id: "OP11-105",
  canonicalId: "OP11-105",
  slug: "charlotte-chiffon/op11-105",
  name: "Charlotte Chiffon",
  printings: [
    {
      id: "OP11-105",
      artId: "OP11-105",
      setCode: "OP11",
      collectorNumber: "105",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-105.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP11",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Firetank Pirates Former Big Mom Pirates"],
  attribute: "wisdom",
  i18n: op11CharlotteChiffon105I18n,
};
